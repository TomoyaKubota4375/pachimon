package online

import (
	"errors"
	"math/rand"
	"sync"
	"time"

	"github.com/TomoyaKubota4375/pachimon/backend/internal/battle"
)

// ErrRoomFull は既に2人揃っている部屋に入ろうとした場合のエラー。
var ErrRoomFull = errors.New("online: room is full")

// ErrBattleNotStarted はバトル開始前に技を出そうとした場合のエラー。
var ErrBattleNotStarted = errors.New("online: battle has not started yet")

// ErrBattleFinished は決着済みのバトルに技を出そうとした場合のエラー。
var ErrBattleFinished = errors.New("online: battle already finished")

// ErrNotAParticipant はこの部屋の参加者ではないPlayerIDが渡された場合のエラー。
var ErrNotAParticipant = errors.New("online: not a participant of this room")

// turnTimeLimit/reconnectGracePeriodはHubごとの設定値。詳しくはhub.goのコメント参照。

// Participant は1人ぶんの接続情報。実際のWebSocket書き込みはSendChを介して
// 別goroutine（ハンドラ側のwrite pump）が行う。ここでは接続の詳細を知らない。
type Participant struct {
	UserID      string
	TrainerName string
	MonsterID   string
	PlayerID    battle.PlayerID
	SendCh      chan ServerMessage
}

// Room はルームコード1つぶんの対戦。
type Room struct {
	mu sync.Mutex

	Code     string
	Player1  *Participant
	Player2  *Participant
	State    *battle.BattleState
	Started  bool
	Finished bool

	hub *Hub

	turnTimer    *time.Timer
	turnDeadline int64 // unixミリ秒。0ならタイマーなし

	disconnectTimers map[battle.PlayerID]*time.Timer
}

func (r *Room) turnTimeLimit() time.Duration {
	if r.hub == nil {
		return defaultTurnTimeLimit
	}
	return r.hub.turnTimeLimit
}

func (r *Room) reconnectGracePeriod() time.Duration {
	if r.hub == nil {
		return defaultReconnectGracePeriod
	}
	return r.hub.reconnectGracePeriod
}

// NewRoom は作成者をPlayer1として新しい部屋を作る。
func NewRoom(code string, creator *Participant, hub *Hub) *Room {
	creator.PlayerID = battle.Player1

	return &Room{
		Code:             code,
		Player1:          creator,
		hub:              hub,
		disconnectTimers: make(map[battle.PlayerID]*time.Timer),
	}
}

// Join はPlayer2として部屋に入る。既に2人揃っていればエラー。
func (r *Room) Join(p *Participant) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if r.Player2 != nil {
		return ErrRoomFull
	}

	p.PlayerID = battle.Player2
	r.Player2 = p

	return nil
}

// ReadyToStart は両者揃っていてまだ開始していないかを返す。
func (r *Room) ReadyToStart() bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	return r.Player1 != nil && r.Player2 != nil && !r.Started
}

// Start はfeatures/battle/data/createInitialBattleState.tsの移植を使って
// バトルを開始する。ReadyToStart()がtrueのときだけ呼ぶこと。
func (r *Room) Start() (battle.BattleState, bool) {
	r.mu.Lock()

	if r.Player1 == nil || r.Player2 == nil || r.Started {
		r.mu.Unlock()
		return battle.BattleState{}, false
	}

	state, ok := battle.NewBattleState(r.Player1.MonsterID, r.Player2.MonsterID)
	if !ok {
		r.mu.Unlock()
		return battle.BattleState{}, false
	}

	// プレイヤー名を実際のトレーナー名にする（デフォルトは「プレイヤー1」等）
	state.Player1.Name = r.Player1.TrainerName
	state.Player2.Name = r.Player2.TrainerName

	r.State = &state
	r.Started = true

	r.mu.Unlock()

	r.armTurnTimer()

	return state, true
}

// SubmitMove は指定プレイヤーの技を受け付け、サーバー側のバトルエンジンで処理する。
func (r *Room) SubmitMove(playerID battle.PlayerID, moveID battle.MoveID) (battle.BattleState, error) {
	r.mu.Lock()

	if playerID != battle.Player1 && playerID != battle.Player2 {
		r.mu.Unlock()
		return battle.BattleState{}, ErrNotAParticipant
	}

	if !r.Started || r.State == nil {
		r.mu.Unlock()
		return battle.BattleState{}, ErrBattleNotStarted
	}

	if r.Finished {
		r.mu.Unlock()
		return battle.BattleState{}, ErrBattleFinished
	}

	next := battle.SelectMove(*r.State, playerID, moveID)
	r.State = &next

	if next.Phase == battle.PhaseFinished {
		r.Finished = true
	}

	r.mu.Unlock()

	switch {
	case next.Phase == battle.PhaseFinished:
		r.clearTurnTimer()
	case next.SelectedMoves.Player1 == nil && next.SelectedMoves.Player2 == nil:
		// 両者の選択がリセットされた＝新しいターンが始まった
		r.armTurnTimer()
	}
	// 片方だけ選択済み（相手待ち）の間はタイマーをリセットしない
	// (先に選んだ側が待つだけで時間稼ぎされないように)

	return next, nil
}

// TurnDeadlineMillis は現在の選択フェーズの締切（unixミリ秒）。0ならタイマーなし。
func (r *Room) TurnDeadlineMillis() int64 {
	r.mu.Lock()
	defer r.mu.Unlock()

	return r.turnDeadline
}

func (r *Room) armTurnTimer() {
	limit := r.turnTimeLimit()

	r.mu.Lock()
	if r.turnTimer != nil {
		r.turnTimer.Stop()
	}
	r.turnDeadline = time.Now().Add(limit).UnixMilli()
	r.turnTimer = time.AfterFunc(limit, r.handleTurnTimeout)
	r.mu.Unlock()
}

func (r *Room) clearTurnTimer() {
	r.mu.Lock()
	if r.turnTimer != nil {
		r.turnTimer.Stop()
		r.turnTimer = nil
	}
	r.turnDeadline = 0
	r.mu.Unlock()
}

// handleTurnTimeout は制限時間内に技を選ばなかったプレイヤーの技をランダムに自動選択する。
func (r *Room) handleTurnTimeout() {
	r.mu.Lock()
	if r.Finished || r.State == nil {
		r.mu.Unlock()
		return
	}

	needP1 := r.State.SelectedMoves.Player1 == nil
	needP2 := r.State.SelectedMoves.Player2 == nil
	p1Moves := r.State.Player1.Monster.Moves
	p2Moves := r.State.Player2.Monster.Moves
	p1PP := r.State.MovePP.Player1
	p2PP := r.State.MovePP.Player2
	r.mu.Unlock()

	if needP1 {
		if moveID, ok := pickRandomAvailableMove(p1Moves, p1PP); ok {
			if state, err := r.SubmitMove(battle.Player1, moveID); err == nil {
				r.Broadcast(r.stateUpdateMessage(state))
			}
		}
	}

	if needP2 {
		if moveID, ok := pickRandomAvailableMove(p2Moves, p2PP); ok {
			if state, err := r.SubmitMove(battle.Player2, moveID); err == nil {
				r.Broadcast(r.stateUpdateMessage(state))
			}
		}
	}

	r.mu.Lock()
	finished := r.Finished
	r.mu.Unlock()

	if finished && r.hub != nil {
		r.hub.RemoveRoom(r.Code)
	}
}

func pickRandomAvailableMove(moves []battle.MoveID, pp battle.MovePP) (battle.MoveID, bool) {
	if len(moves) == 0 {
		return "", false
	}

	available := make([]battle.MoveID, 0, len(moves))
	for _, moveID := range moves {
		if pp[moveID] > 0 {
			available = append(available, moveID)
		}
	}

	if len(available) == 0 {
		// 通常は起きない(PPが尽きている)が、フォールバックとして先頭の技を返す
		return moves[0], true
	}

	return available[rand.Intn(len(available))], true
}

// stateUpdateMessage は現在の締切情報つきでstate_updateメッセージを組み立てる。
func (r *Room) stateUpdateMessage(state battle.BattleState) ServerMessage {
	return ServerMessage{
		Type:         ServerStateUpdate,
		State:        &state,
		TurnDeadline: r.TurnDeadlineMillis(),
	}
}

// HandleDisconnect は接続が切れたときに呼ぶ。即座に部屋を破棄せず、
// reconnectGracePeriodの間だけ相手に「再接続待ち」を伝えて猶予する。
func (r *Room) HandleDisconnect(playerID battle.PlayerID) {
	r.mu.Lock()
	if r.Finished {
		r.mu.Unlock()
		return
	}

	if existing, ok := r.disconnectTimers[playerID]; ok && existing != nil {
		existing.Stop()
	}

	r.disconnectTimers[playerID] = time.AfterFunc(r.reconnectGracePeriod(), func() {
		r.finalizeDisconnect(playerID)
	})
	r.mu.Unlock()

	r.SendTo(opponentOf(playerID), ServerMessage{
		Type:    ServerOpponentDisconnected,
		Message: "相手の接続が切れました。再接続を待っています...",
	})
}

func (r *Room) finalizeDisconnect(playerID battle.PlayerID) {
	r.mu.Lock()
	if r.Finished {
		r.mu.Unlock()
		return
	}
	r.Finished = true
	r.mu.Unlock()

	r.clearTurnTimer()

	r.SendTo(opponentOf(playerID), ServerMessage{
		Type:    ServerRoomClosed,
		Message: "対戦相手が戻ってきませんでした。",
	})

	if r.hub != nil {
		r.hub.RemoveRoom(r.Code)
	}
}

// FindPlayerIDByUserID はuserIDが参加者のどちらかを探す（再接続時に自陣営を特定するため）。
func (r *Room) FindPlayerIDByUserID(userID string) (battle.PlayerID, bool) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if r.Player1 != nil && r.Player1.UserID == userID {
		return battle.Player1, true
	}
	if r.Player2 != nil && r.Player2.UserID == userID {
		return battle.Player2, true
	}

	return "", false
}

// Rejoin は再接続してきたparticipantを元の陣営に結びつけ直し、現在のstateを返す。
func (r *Room) Rejoin(playerID battle.PlayerID, newParticipant *Participant) (battle.BattleState, error) {
	r.mu.Lock()

	if r.Finished {
		r.mu.Unlock()
		return battle.BattleState{}, ErrBattleFinished
	}

	existing := r.participantLocked(playerID)
	if existing == nil {
		r.mu.Unlock()
		return battle.BattleState{}, ErrNotAParticipant
	}

	newParticipant.PlayerID = playerID
	newParticipant.MonsterID = existing.MonsterID
	newParticipant.TrainerName = existing.TrainerName

	if playerID == battle.Player1 {
		r.Player1 = newParticipant
	} else {
		r.Player2 = newParticipant
	}

	if timer, ok := r.disconnectTimers[playerID]; ok && timer != nil {
		timer.Stop()
		delete(r.disconnectTimers, playerID)
	}

	if r.State == nil {
		r.mu.Unlock()
		return battle.BattleState{}, ErrBattleNotStarted
	}

	state := *r.State
	r.mu.Unlock()

	r.SendTo(opponentOf(playerID), ServerMessage{Type: ServerOpponentReconnected})

	return state, nil
}

// Broadcast は両プレイヤーの送信チャネルにメッセージを流す
// (相手がまだ居ない場合はPlayer1にだけ届く)。
func (r *Room) Broadcast(msg ServerMessage) {
	r.mu.Lock()
	p1 := r.Player1
	p2 := r.Player2
	r.mu.Unlock()

	if p1 != nil {
		sendNonBlocking(p1.SendCh, msg)
	}
	if p2 != nil {
		sendNonBlocking(p2.SendCh, msg)
	}
}

// SendTo は指定プレイヤーだけにメッセージを送る。
func (r *Room) SendTo(playerID battle.PlayerID, msg ServerMessage) {
	r.mu.Lock()
	p := r.participantLocked(playerID)
	r.mu.Unlock()

	if p != nil {
		sendNonBlocking(p.SendCh, msg)
	}
}

// Opponent はplayerIDの相手側Participantを返す（まだ居なければnil）。
func (r *Room) Opponent(playerID battle.PlayerID) *Participant {
	r.mu.Lock()
	defer r.mu.Unlock()

	return r.participantLocked(opponentOf(playerID))
}

func (r *Room) participantLocked(playerID battle.PlayerID) *Participant {
	if playerID == battle.Player1 {
		return r.Player1
	}
	return r.Player2
}

func opponentOf(playerID battle.PlayerID) battle.PlayerID {
	if playerID == battle.Player1 {
		return battle.Player2
	}
	return battle.Player1
}

func sendNonBlocking(ch chan ServerMessage, msg ServerMessage) {
	select {
	case ch <- msg:
	default:
		// 送信バッファが詰まっている＝接続がもう死んでいる可能性が高いので無視する
		// （write pump側の切断処理に任せる）
	}
}
