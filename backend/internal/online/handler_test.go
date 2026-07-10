package online

import (
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"

	"github.com/TomoyaKubota4375/pachimon/backend/internal/auth"
	"github.com/TomoyaKubota4375/pachimon/backend/internal/battle"
)

func newTestServer(t *testing.T) (*httptest.Server, *auth.TokenIssuer) {
	t.Helper()

	gin.SetMode(gin.TestMode)

	hub := NewHub()
	tokens := auth.NewTokenIssuer("test-secret")
	handler := NewHandler(hub, tokens)

	r := gin.New()
	r.GET("/ws/battle", handler.ServeWS)

	server := httptest.NewServer(r)
	t.Cleanup(server.Close)

	return server, tokens
}

func dialWS(t *testing.T, server *httptest.Server, token string) *websocket.Conn {
	t.Helper()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "/ws/battle?token=" + token

	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("dial failed: %v", err)
	}

	t.Cleanup(func() { conn.Close() })

	return conn
}

func readMessage(t *testing.T, conn *websocket.Conn) ServerMessage {
	t.Helper()

	conn.SetReadDeadline(time.Now().Add(3 * time.Second))

	var msg ServerMessage
	if err := conn.ReadJSON(&msg); err != nil {
		t.Fatalf("ReadJSON failed: %v", err)
	}

	return msg
}

func TestServeWS_RejectsMissingToken(t *testing.T) {
	server, _ := newTestServer(t)

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "/ws/battle"

	_, resp, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err == nil {
		t.Fatal("expected dial to fail without a token")
	}

	if resp == nil || resp.StatusCode != 401 {
		t.Fatalf("expected 401, got resp=%v", resp)
	}
}

func TestServeWS_FullMatchFlow(t *testing.T) {
	server, tokens := newTestServer(t)

	token1, err := tokens.IssueToken(uuid.New())
	if err != nil {
		t.Fatalf("IssueToken: %v", err)
	}
	token2, err := tokens.IssueToken(uuid.New())
	if err != nil {
		t.Fatalf("IssueToken: %v", err)
	}

	conn1 := dialWS(t, server, token1)
	conn2 := dialWS(t, server, token2)

	// player1: 部屋を作る
	if err := conn1.WriteJSON(ClientMessage{
		Type: ClientCreateRoom, MonsterID: "ikarimon", TrainerName: "サトシ",
	}); err != nil {
		t.Fatalf("write create_room: %v", err)
	}

	created := readMessage(t, conn1)
	if created.Type != ServerRoomCreated || created.RoomCode == "" {
		t.Fatalf("expected room_created with a code, got %+v", created)
	}

	waiting := readMessage(t, conn1)
	if waiting.Type != ServerWaitingForOpponent {
		t.Fatalf("expected waiting_for_opponent, got %+v", waiting)
	}

	// player2: そのコードで入る
	if err := conn2.WriteJSON(ClientMessage{
		Type: ClientJoinRoom, RoomCode: created.RoomCode, MonsterID: "bonmon", TrainerName: "ハナコ",
	}); err != nil {
		t.Fatalf("write join_room: %v", err)
	}

	start1 := readMessage(t, conn1)
	start2 := readMessage(t, conn2)

	if start1.Type != ServerBattleStart || start2.Type != ServerBattleStart {
		t.Fatalf("expected battle_start for both, got %+v / %+v", start1, start2)
	}

	if start1.You != battle.Player1 || start2.You != battle.Player2 {
		t.Fatalf("expected player1/player2 assignment, got %s/%s", start1.You, start2.You)
	}

	if start1.State == nil || start1.State.Player1.Monster.ID != "ikarimon" || start1.State.Player2.Monster.ID != "bonmon" {
		t.Fatalf("unexpected initial state: %+v", start1.State)
	}

	if start1.State.Player1.Name != "サトシ" || start1.State.Player2.Name != "ハナコ" {
		t.Fatalf("expected trainer names in state, got %q/%q", start1.State.Player1.Name, start1.State.Player2.Name)
	}

	// player1が技を出す → まだ相手待ちなので状態更新は届くがフェーズは変わらない
	if err := conn1.WriteJSON(ClientMessage{Type: ClientSelectMove, MoveID: "ikari-power-up"}); err != nil {
		t.Fatalf("write select_move (p1): %v", err)
	}

	afterP1Move1 := readMessage(t, conn1)
	afterP1Move2 := readMessage(t, conn2)

	if afterP1Move1.Type != ServerStateUpdate || afterP1Move2.Type != ServerStateUpdate {
		t.Fatalf("expected state_update for both after p1 move, got %+v / %+v", afterP1Move1, afterP1Move2)
	}

	// player2が技を出す → ターンが実行される
	if err := conn2.WriteJSON(ClientMessage{Type: ClientSelectMove, MoveID: "bon-quick-hit"}); err != nil {
		t.Fatalf("write select_move (p2): %v", err)
	}

	afterTurn1 := readMessage(t, conn1)
	afterTurn2 := readMessage(t, conn2)

	if afterTurn1.Type != ServerStateUpdate || afterTurn2.Type != ServerStateUpdate {
		t.Fatalf("expected state_update for both after the turn resolves, got %+v / %+v", afterTurn1, afterTurn2)
	}

	if afterTurn1.State.Turn < 2 {
		t.Fatalf("expected turn to have advanced past 1, got %d", afterTurn1.State.Turn)
	}
}

func TestServeWS_OpponentDisconnected(t *testing.T) {
	server, tokens := newTestServer(t)

	token1, _ := tokens.IssueToken(uuid.New())
	token2, _ := tokens.IssueToken(uuid.New())

	conn1 := dialWS(t, server, token1)
	conn2 := dialWS(t, server, token2)

	conn1.WriteJSON(ClientMessage{Type: ClientCreateRoom, MonsterID: "ikarimon", TrainerName: "サトシ"})
	created := readMessage(t, conn1)
	readMessage(t, conn1) // waiting_for_opponent

	conn2.WriteJSON(ClientMessage{Type: ClientJoinRoom, RoomCode: created.RoomCode, MonsterID: "bonmon", TrainerName: "ハナコ"})
	readMessage(t, conn1) // battle_start
	readMessage(t, conn2) // battle_start

	conn2.Close()

	disconnect := readMessage(t, conn1)
	if disconnect.Type != ServerOpponentDisconnected {
		t.Fatalf("expected opponent_disconnected, got %+v", disconnect)
	}
}
