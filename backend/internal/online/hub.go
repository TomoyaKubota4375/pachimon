package online

import (
	"crypto/rand"
	"errors"
	"sync"
	"time"
)

// ErrRoomNotFound は存在しない・もう終わったルームコードを指定した場合のエラー。
var ErrRoomNotFound = errors.New("online: room not found")

// 紛らわしい文字（0/O, 1/I）を避けたコード用文字セット。
const roomCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
const roomCodeLength = 6

const (
	defaultTurnTimeLimit        = 30 * time.Second
	defaultReconnectGracePeriod = 30 * time.Second
)

// Hub は現在アクティブな部屋の一覧を管理する。
// turnTimeLimit/reconnectGracePeriodをHubごとに持たせているのは、パッケージ変数だと
// テストで短縮したときに他のテストのタイマーと干渉してしまうため（各テストが自分専用の
// Hubを作れば完全に独立させられる）。
type Hub struct {
	mu    sync.Mutex
	rooms map[string]*Room

	turnTimeLimit        time.Duration
	reconnectGracePeriod time.Duration
}

// NewHub は空のHubを作る（タイムアウト類はデフォルト値）。
func NewHub() *Hub {
	return NewHubWithTimers(defaultTurnTimeLimit, defaultReconnectGracePeriod)
}

// NewHubWithTimers はタイムアウトの長さを指定してHubを作る（主にテスト用）。
func NewHubWithTimers(turnTimeLimit, reconnectGracePeriod time.Duration) *Hub {
	return &Hub{
		rooms:                make(map[string]*Room),
		turnTimeLimit:        turnTimeLimit,
		reconnectGracePeriod: reconnectGracePeriod,
	}
}

// CreateRoom は新しいルームコードを発行して部屋を作る。
func (h *Hub) CreateRoom(creator *Participant) (*Room, error) {
	h.mu.Lock()
	defer h.mu.Unlock()

	code, err := h.generateUniqueCodeLocked()
	if err != nil {
		return nil, err
	}

	room := NewRoom(code, creator, h)
	h.rooms[code] = room

	return room, nil
}

// JoinRoom は既存の部屋にPlayer2として入る。
func (h *Hub) JoinRoom(code string, p *Participant) (*Room, error) {
	h.mu.Lock()
	room, ok := h.rooms[code]
	h.mu.Unlock()

	if !ok {
		return nil, ErrRoomNotFound
	}

	if err := room.Join(p); err != nil {
		return nil, err
	}

	return room, nil
}

// GetRoom はコードから部屋を探す。
func (h *Hub) GetRoom(code string) (*Room, bool) {
	h.mu.Lock()
	defer h.mu.Unlock()

	room, ok := h.rooms[code]
	return room, ok
}

// RemoveRoom は部屋を一覧から取り除く（対戦終了・切断時に呼ぶ）。
func (h *Hub) RemoveRoom(code string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	delete(h.rooms, code)
}

func (h *Hub) generateUniqueCodeLocked() (string, error) {
	for attempt := 0; attempt < 20; attempt++ {
		code, err := randomRoomCode()
		if err != nil {
			return "", err
		}

		if _, exists := h.rooms[code]; !exists {
			return code, nil
		}
	}

	return "", errors.New("online: failed to generate a unique room code")
}

func randomRoomCode() (string, error) {
	buf := make([]byte, roomCodeLength)

	if _, err := rand.Read(buf); err != nil {
		return "", err
	}

	code := make([]byte, roomCodeLength)
	for i, b := range buf {
		code[i] = roomCodeAlphabet[int(b)%len(roomCodeAlphabet)]
	}

	return string(code), nil
}
