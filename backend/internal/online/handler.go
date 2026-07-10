package online

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"

	"github.com/TomoyaKubota4375/pachimon/backend/internal/auth"
	"github.com/TomoyaKubota4375/pachimon/backend/internal/battle"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	sendBufferSize = 16
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// フロントは別オリジン（devサーバーのポートが違う）から繋いでくるので許可する。
	// 認証はクエリのJWTトークンで行っているのでOriginは緩めてよい。
	CheckOrigin: func(r *http.Request) bool { return true },
}

// Handler はWebSocketエンドポイントを提供する。
type Handler struct {
	hub    *Hub
	tokens *auth.TokenIssuer
}

// NewHandler はHandlerを作る。
func NewHandler(hub *Hub, tokens *auth.TokenIssuer) *Handler {
	return &Handler{hub: hub, tokens: tokens}
}

// ServeWS は GET /ws/battle のハンドラ。トークンはクエリパラメータで渡す
// （ブラウザのWebSocket APIはカスタムヘッダを付けられないため）。
func (h *Handler) ServeWS(c *gin.Context) {
	token := c.Query("token")

	userID, err := h.tokens.ParseToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "認証が必要です"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("online: upgrade failed: %v", err)
		return
	}

	session := &connSession{
		conn:   conn,
		hub:    h.hub,
		userID: userID.String(),
		sendCh: make(chan ServerMessage, sendBufferSize),
	}

	go session.writePump()
	session.readPump()
}

// connSession は1つのWebSocket接続の生存期間ぶんの状態。
type connSession struct {
	conn   *websocket.Conn
	hub    *Hub
	userID string
	sendCh chan ServerMessage

	room        *Room
	participant *Participant
}

func (s *connSession) readPump() {
	defer s.cleanup()

	s.conn.SetReadDeadline(time.Now().Add(pongWait))
	s.conn.SetPongHandler(func(string) error {
		s.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, raw, err := s.conn.ReadMessage()
		if err != nil {
			return
		}

		var msg ClientMessage
		if err := json.Unmarshal(raw, &msg); err != nil {
			s.sendError("メッセージの形式が正しくありません")
			continue
		}

		s.handleMessage(msg)
	}
}

func (s *connSession) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer ticker.Stop()
	defer s.conn.Close()

	for {
		select {
		case msg, ok := <-s.sendCh:
			s.conn.SetWriteDeadline(time.Now().Add(writeWait))

			if !ok {
				s.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := s.conn.WriteJSON(msg); err != nil {
				return
			}

		case <-ticker.C:
			s.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := s.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (s *connSession) handleMessage(msg ClientMessage) {
	switch msg.Type {
	case ClientCreateRoom:
		s.handleCreateRoom(msg)
	case ClientJoinRoom:
		s.handleJoinRoom(msg)
	case ClientRejoinRoom:
		s.handleRejoinRoom(msg)
	case ClientSelectMove:
		s.handleSelectMove(msg)
	default:
		s.sendError("不明なメッセージ種別です")
	}
}

func (s *connSession) handleCreateRoom(msg ClientMessage) {
	if s.room != nil {
		s.sendError("既に部屋に参加しています")
		return
	}

	if _, ok := battle.FindMonster(msg.MonsterID); !ok {
		s.sendError("モンスターIDが不正です")
		return
	}

	participant := &Participant{
		UserID:      s.userID,
		TrainerName: displayName(msg.TrainerName),
		MonsterID:   msg.MonsterID,
		SendCh:      s.sendCh,
	}

	room, err := s.hub.CreateRoom(participant)
	if err != nil {
		s.sendError("部屋の作成に失敗しました")
		return
	}

	s.room = room
	s.participant = participant

	s.sendCh <- ServerMessage{Type: ServerRoomCreated, RoomCode: room.Code}
	s.sendCh <- ServerMessage{Type: ServerWaitingForOpponent}
}

func (s *connSession) handleJoinRoom(msg ClientMessage) {
	if s.room != nil {
		s.sendError("既に部屋に参加しています")
		return
	}

	if _, ok := battle.FindMonster(msg.MonsterID); !ok {
		s.sendError("モンスターIDが不正です")
		return
	}

	participant := &Participant{
		UserID:      s.userID,
		TrainerName: displayName(msg.TrainerName),
		MonsterID:   msg.MonsterID,
		SendCh:      s.sendCh,
	}

	room, err := s.hub.JoinRoom(msg.RoomCode, participant)
	if err != nil {
		switch err {
		case ErrRoomNotFound:
			s.sendError("その部屋コードは見つかりませんでした")
		case ErrRoomFull:
			s.sendError("その部屋は既に満員です")
		default:
			s.sendError("部屋への参加に失敗しました")
		}
		return
	}

	s.room = room
	s.participant = participant

	if !room.ReadyToStart() {
		return
	}

	state, ok := room.Start()
	if !ok {
		s.sendError("バトルの開始に失敗しました")
		return
	}

	deadline := room.TurnDeadlineMillis()

	room.SendTo(battle.Player1, ServerMessage{Type: ServerBattleStart, You: battle.Player1, State: &state, TurnDeadline: deadline})
	room.SendTo(battle.Player2, ServerMessage{Type: ServerBattleStart, You: battle.Player2, State: &state, TurnDeadline: deadline})
}

// handleRejoinRoom は接続が切れたプレイヤーが再接続してきたときの処理。
// reconnectGracePeriod以内なら元の陣営に復帰でき、現在のstateがそのまま届く。
func (s *connSession) handleRejoinRoom(msg ClientMessage) {
	if s.room != nil {
		s.sendError("既に部屋に参加しています")
		return
	}

	room, ok := s.hub.GetRoom(msg.RoomCode)
	if !ok {
		s.sendError("その部屋コードは見つかりませんでした")
		return
	}

	playerID, ok := room.FindPlayerIDByUserID(s.userID)
	if !ok {
		s.sendError("この部屋の参加者ではありません")
		return
	}

	participant := &Participant{
		UserID: s.userID,
		SendCh: s.sendCh,
	}

	state, err := room.Rejoin(playerID, participant)
	if err != nil {
		s.sendError(rejoinErrorMessage(err))
		return
	}

	s.room = room
	s.participant = participant

	s.sendCh <- ServerMessage{
		Type:         ServerBattleStart,
		You:          playerID,
		State:        &state,
		TurnDeadline: room.TurnDeadlineMillis(),
	}
}

func (s *connSession) handleSelectMove(msg ClientMessage) {
	if s.room == nil || s.participant == nil {
		s.sendError("まだ部屋に参加していません")
		return
	}

	next, err := s.room.SubmitMove(s.participant.PlayerID, msg.MoveID)
	if err != nil {
		s.sendError(moveErrorMessage(err))
		return
	}

	s.room.Broadcast(s.room.stateUpdateMessage(next))

	if next.Phase == battle.PhaseFinished {
		s.hub.RemoveRoom(s.room.Code)
	}
}

// cleanup はreadPumpが終了する（＝接続が切れた）ときに呼ぶ。
// 部屋は即座には破棄せず、Room.HandleDisconnectがreconnectGracePeriodの間
// 再接続を待つ（詳細はroom.goのコメント参照）。
//
// s.sendChはここでcloseしない: 相手側セッションのcleanupが同時に走ると
// 「相手のSendChへ送信 (sendNonBlocking) しようとした瞬間に、相手が自分の
// SendChをcloseする」というレースでpanicする可能性があるため。
// writePump側はconn.Close()後の書き込みエラーで自然に終了するので、
// チャネルをcloseしなくても goroutine リークにはならない。
func (s *connSession) cleanup() {
	s.conn.Close()

	if s.room != nil && s.participant != nil {
		s.room.HandleDisconnect(s.participant.PlayerID)
	}
}

func (s *connSession) sendError(message string) {
	sendNonBlocking(s.sendCh, ServerMessage{Type: ServerError, Message: message})
}

func displayName(name string) string {
	if name == "" {
		return "トレーナー"
	}
	return name
}

func moveErrorMessage(err error) string {
	switch err {
	case ErrBattleNotStarted:
		return "まだバトルが始まっていません"
	case ErrBattleFinished:
		return "バトルは既に終了しています"
	case ErrNotAParticipant:
		return "この部屋の参加者ではありません"
	default:
		return "技の送信に失敗しました"
	}
}

func rejoinErrorMessage(err error) string {
	switch err {
	case ErrBattleFinished:
		return "この部屋は既に終了しています"
	case ErrBattleNotStarted:
		return "まだバトルが始まっていません"
	case ErrNotAParticipant:
		return "この部屋の参加者ではありません"
	default:
		return "再接続に失敗しました"
	}
}
