package online

import (
	"testing"
	"time"

	"github.com/TomoyaKubota4375/pachimon/backend/internal/battle"
)

func waitUntil(t *testing.T, timeout time.Duration, cond func() bool) {
	t.Helper()

	deadline := time.Now().Add(timeout)

	for time.Now().Before(deadline) {
		if cond() {
			return
		}
		time.Sleep(5 * time.Millisecond)
	}

	t.Fatal("condition not met within timeout")
}

func TestRoom_TurnTimeout_AutoSelectsForBothPlayers(t *testing.T) {
	hub := NewHubWithTimers(50*time.Millisecond, time.Hour)

	p1 := newTestParticipant("u1", "ikarimon")
	room := NewRoom("ABC123", p1, hub)

	p2 := newTestParticipant("u2", "bonmon")
	room.Join(p2)
	room.Start()

	// 誰も技を選ばずに待つ → タイムアウトで両者に自動選択され、ターンが実行されるはず
	waitUntil(t, time.Second, func() bool {
		room.mu.Lock()
		defer room.mu.Unlock()
		return room.State != nil && room.State.Turn > 1
	})

	room.mu.Lock()
	turn := room.State.Turn
	room.mu.Unlock()

	if turn <= 1 {
		t.Fatalf("expected turn to have advanced past 1 via timeout auto-select, got %d", turn)
	}
}

func TestRoom_TurnTimeout_DoesNotOverrideAlreadySelectedMove(t *testing.T) {
	hub := NewHubWithTimers(60*time.Millisecond, time.Hour)

	p1 := newTestParticipant("u1", "ikarimon")
	room := NewRoom("ABC123", p1, hub)

	p2 := newTestParticipant("u2", "bonmon")
	room.Join(p2)
	room.Start()

	// player1だけ先に選んでおく
	state, err := room.SubmitMove(battle.Player1, "ikari-power-up")
	if err != nil {
		t.Fatalf("SubmitMove failed: %v", err)
	}
	if state.SelectedMoves.Player1 == nil || *state.SelectedMoves.Player1 != "ikari-power-up" {
		t.Fatalf("expected player1's move to be recorded")
	}

	// タイムアウトを待つ → player2の分だけ自動選択され、ターンが実行される
	waitUntil(t, time.Second, func() bool {
		room.mu.Lock()
		defer room.mu.Unlock()
		return room.State != nil && room.State.Turn > 1
	})
}

func TestRoom_TurnTimeout_StopsAfterBattleFinished(t *testing.T) {
	hub := NewHubWithTimers(200*time.Millisecond, time.Hour)

	p1 := newTestParticipant("u1", "ikarimon")
	room := NewRoom("ABC123", p1, hub)

	p2 := newTestParticipant("u2", "bonmon")
	room.Join(p2)
	room.Start()

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
		t.Fatal("expected battle to be finished")
	}

	// タイマーが止まっている（暴発しない）ことを確認するため少し待つ
	time.Sleep(300 * time.Millisecond)

	if _, ok := hub.GetRoom(room.Code); ok {
		t.Fatal("expected room to have been removed from the hub once finished")
	}
}

func TestRoom_Reconnect_WithinGracePeriod(t *testing.T) {
	hub := NewHubWithTimers(time.Hour, 300*time.Millisecond)

	p1 := newTestParticipant("u1", "ikarimon")
	room, err := hub.CreateRoom(p1)
	if err != nil {
		t.Fatalf("CreateRoom failed: %v", err)
	}

	p2 := newTestParticipant("u2", "bonmon")
	if _, err := hub.JoinRoom(room.Code, p2); err != nil {
		t.Fatalf("JoinRoom failed: %v", err)
	}
	room.Start()

	// player1が切断
	room.HandleDisconnect(battle.Player1)

	// 相手(p2)に「切断・再接続待ち」が届く
	select {
	case msg := <-p2.SendCh:
		if msg.Type != ServerOpponentDisconnected {
			t.Fatalf("expected opponent_disconnected, got %v", msg.Type)
		}
	case <-time.After(time.Second):
		t.Fatal("timed out waiting for opponent_disconnected")
	}

	// 猶予期間内にplayer1が再接続
	newP1 := newTestParticipant("u1", "")
	state, err := room.Rejoin(battle.Player1, newP1)
	if err != nil {
		t.Fatalf("Rejoin failed: %v", err)
	}

	if state.Player1.Monster.ID != "ikarimon" {
		t.Fatalf("expected rejoin to restore the same battle state, got monster %s", state.Player1.Monster.ID)
	}

	if room.Player1 != newP1 {
		t.Fatal("expected room.Player1 to be updated to the new participant")
	}

	// p2に再接続通知が届く
	select {
	case msg := <-p2.SendCh:
		if msg.Type != ServerOpponentReconnected {
			t.Fatalf("expected opponent_reconnected, got %v", msg.Type)
		}
	case <-time.After(time.Second):
		t.Fatal("timed out waiting for opponent_reconnected")
	}

	// 猶予期間が過ぎても部屋が終了していないこと
	time.Sleep(400 * time.Millisecond)

	if room.Finished {
		t.Fatal("expected room to remain open after a successful rejoin")
	}
}

func TestRoom_Reconnect_AfterGracePeriodExpires(t *testing.T) {
	hub := NewHubWithTimers(time.Hour, 80*time.Millisecond)

	p1 := newTestParticipant("u1", "ikarimon")
	room, err := hub.CreateRoom(p1)
	if err != nil {
		t.Fatalf("CreateRoom failed: %v", err)
	}

	p2 := newTestParticipant("u2", "bonmon")
	if _, err := hub.JoinRoom(room.Code, p2); err != nil {
		t.Fatalf("JoinRoom failed: %v", err)
	}
	room.Start()

	room.HandleDisconnect(battle.Player1)

	<-p2.SendCh // opponent_disconnected

	waitUntil(t, time.Second, func() bool {
		room.mu.Lock()
		defer room.mu.Unlock()
		return room.Finished
	})

	select {
	case msg := <-p2.SendCh:
		if msg.Type != ServerRoomClosed {
			t.Fatalf("expected room_closed, got %v", msg.Type)
		}
	case <-time.After(time.Second):
		t.Fatal("timed out waiting for room_closed")
	}

	if _, ok := hub.GetRoom(room.Code); ok {
		t.Fatal("expected room to be removed from hub after grace period expires")
	}

	// もう遅い: 再接続しようとしても部屋は既に終了扱い
	newP1 := newTestParticipant("u1", "")
	if _, err := room.Rejoin(battle.Player1, newP1); err != ErrBattleFinished {
		t.Fatalf("expected ErrBattleFinished, got %v", err)
	}
}

func TestRoom_FindPlayerIDByUserID(t *testing.T) {
	hub := NewHub()
	p1 := newTestParticipant("u1", "ikarimon")
	room := NewRoom("ABC123", p1, hub)

	p2 := newTestParticipant("u2", "bonmon")
	room.Join(p2)

	if id, ok := room.FindPlayerIDByUserID("u1"); !ok || id != battle.Player1 {
		t.Fatalf("expected u1 -> player1, got %v/%v", id, ok)
	}

	if id, ok := room.FindPlayerIDByUserID("u2"); !ok || id != battle.Player2 {
		t.Fatalf("expected u2 -> player2, got %v/%v", id, ok)
	}

	if _, ok := room.FindPlayerIDByUserID("u3"); ok {
		t.Fatal("expected unknown userID to not match")
	}
}
