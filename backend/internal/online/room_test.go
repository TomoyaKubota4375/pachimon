package online

import (
	"testing"

	"github.com/TomoyaKubota4375/pachimon/backend/internal/battle"
)

func newTestParticipant(userID, monsterID string) *Participant {
	return &Participant{
		UserID:      userID,
		TrainerName: "テストトレーナー",
		MonsterID:   monsterID,
		SendCh:      make(chan ServerMessage, 16),
	}
}

func TestHub_CreateAndJoinRoom(t *testing.T) {
	hub := NewHub()

	p1 := newTestParticipant("u1", "bonmon")
	room, err := hub.CreateRoom(p1)
	if err != nil {
		t.Fatalf("CreateRoom failed: %v", err)
	}

	if len(room.Code) != roomCodeLength {
		t.Fatalf("expected room code length %d, got %q", roomCodeLength, room.Code)
	}

	if room.ReadyToStart() {
		t.Fatal("room should not be ready to start with only 1 player")
	}

	p2 := newTestParticipant("u2", "kanjimon")
	joinedRoom, err := hub.JoinRoom(room.Code, p2)
	if err != nil {
		t.Fatalf("JoinRoom failed: %v", err)
	}

	if joinedRoom != room {
		t.Fatal("JoinRoom should return the same room instance")
	}

	if !room.ReadyToStart() {
		t.Fatal("room should be ready to start once both players joined")
	}
}

func TestHub_JoinRoom_NotFound(t *testing.T) {
	hub := NewHub()

	_, err := hub.JoinRoom("NOPE12", newTestParticipant("u1", "bonmon"))
	if err != ErrRoomNotFound {
		t.Fatalf("expected ErrRoomNotFound, got %v", err)
	}
}

func TestHub_JoinRoom_Full(t *testing.T) {
	hub := NewHub()

	room, _ := hub.CreateRoom(newTestParticipant("u1", "bonmon"))
	_, err := hub.JoinRoom(room.Code, newTestParticipant("u2", "kanjimon"))
	if err != nil {
		t.Fatalf("first join should succeed: %v", err)
	}

	_, err = hub.JoinRoom(room.Code, newTestParticipant("u3", "hiroyamon"))
	if err != ErrRoomFull {
		t.Fatalf("expected ErrRoomFull, got %v", err)
	}
}

func TestRoom_StartAssignsPlayerNames(t *testing.T) {
	room := NewRoom("ABC123", newTestParticipant("u1", "bonmon"), NewHub())
	room.Player1.TrainerName = "サトシ"

	p2 := newTestParticipant("u2", "kanjimon")
	p2.TrainerName = "ハナコ"
	room.Join(p2)

	state, ok := room.Start()
	if !ok {
		t.Fatal("Start should succeed once both players joined")
	}

	if state.Player1.Name != "サトシ" || state.Player2.Name != "ハナコ" {
		t.Fatalf("expected player names to be trainer names, got %q / %q", state.Player1.Name, state.Player2.Name)
	}

	if state.Player1.Monster.ID != "bonmon" || state.Player2.Monster.ID != "kanjimon" {
		t.Fatalf("expected monsters bonmon/kanjimon, got %s/%s", state.Player1.Monster.ID, state.Player2.Monster.ID)
	}

	if _, ok := room.Start(); ok {
		t.Fatal("Start should not succeed a second time")
	}
}

func TestRoom_SubmitMove_BeforeStart(t *testing.T) {
	room := NewRoom("ABC123", newTestParticipant("u1", "bonmon"), NewHub())

	_, err := room.SubmitMove(battle.Player1, "bon-quick-hit")
	if err != ErrBattleNotStarted {
		t.Fatalf("expected ErrBattleNotStarted, got %v", err)
	}
}

func TestRoom_SubmitMove_FullFlow(t *testing.T) {
	room := NewRoom("ABC123", newTestParticipant("u1", "ikarimon"), NewHub())
	room.Join(newTestParticipant("u2", "bonmon"))
	room.Start()

	state, err := room.SubmitMove(battle.Player1, "ikari-power-up")
	if err != nil {
		t.Fatalf("SubmitMove (player1) failed: %v", err)
	}

	if state.SelectedMoves.Player1 == nil {
		t.Fatal("expected player1's move to be recorded while waiting for player2")
	}

	state, err = room.SubmitMove(battle.Player2, "bon-quick-hit")
	if err != nil {
		t.Fatalf("SubmitMove (player2) failed: %v", err)
	}

	// 両者出し終わったのでターンが実行され、選択はリセットされているはず
	if state.SelectedMoves.Player1 != nil || state.SelectedMoves.Player2 != nil {
		t.Fatal("expected selected moves to be cleared after the turn executes")
	}

	if state.Turn < 1 {
		t.Fatalf("expected turn to have advanced, got %d", state.Turn)
	}
}

func TestRoom_SubmitMove_AfterFinished(t *testing.T) {
	room := NewRoom("ABC123", newTestParticipant("u1", "ikarimon"), NewHub())
	room.Join(newTestParticipant("u2", "bonmon"))
	room.Start()

	// 決着がつくまで殴り合う
	for i := 0; i < 200; i++ {
		state, err := room.SubmitMove(battle.Player1, "ikari-heavy-blow")
		if err != nil {
			t.Fatalf("SubmitMove failed: %v", err)
		}

		if state.Phase == battle.PhaseFinished {
			break
		}

		state, err = room.SubmitMove(battle.Player2, "bon-quick-hit")
		if err != nil {
			t.Fatalf("SubmitMove failed: %v", err)
		}

		if state.Phase == battle.PhaseFinished {
			break
		}
	}

	if !room.Finished {
		t.Fatal("expected room.Finished to be true after the battle concludes")
	}

	if _, err := room.SubmitMove(battle.Player1, "ikari-heavy-blow"); err != ErrBattleFinished {
		t.Fatalf("expected ErrBattleFinished, got %v", err)
	}
}

func TestRoom_Broadcast_SendsToBothParticipants(t *testing.T) {
	p1 := newTestParticipant("u1", "bonmon")
	room := NewRoom("ABC123", p1, NewHub())

	p2 := newTestParticipant("u2", "kanjimon")
	room.Join(p2)

	room.Broadcast(ServerMessage{Type: ServerStateUpdate})

	select {
	case msg := <-p1.SendCh:
		if msg.Type != ServerStateUpdate {
			t.Fatalf("unexpected message for p1: %v", msg)
		}
	default:
		t.Fatal("expected p1 to receive a broadcast message")
	}

	select {
	case msg := <-p2.SendCh:
		if msg.Type != ServerStateUpdate {
			t.Fatalf("unexpected message for p2: %v", msg)
		}
	default:
		t.Fatal("expected p2 to receive a broadcast message")
	}
}

func TestRoom_Opponent(t *testing.T) {
	p1 := newTestParticipant("u1", "bonmon")
	room := NewRoom("ABC123", p1, NewHub())

	if room.Opponent(battle.Player1) != nil {
		t.Fatal("expected no opponent before player2 joins")
	}

	p2 := newTestParticipant("u2", "kanjimon")
	room.Join(p2)

	if room.Opponent(battle.Player1) != p2 {
		t.Fatal("expected player1's opponent to be p2")
	}

	if room.Opponent(battle.Player2) != p1 {
		t.Fatal("expected player2's opponent to be p1")
	}
}
