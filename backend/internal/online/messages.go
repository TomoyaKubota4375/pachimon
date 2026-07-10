// Package online はオンライン対戦（ルームコードでのマッチング＋WebSocketでの
// リアルタイム対戦）を扱う。バトルの実処理自体は internal/battle にまかせ、
// このパッケージは「誰と誰をどう繋ぐか」「サーバー権威でどう同期するか」を担当する。
package online

import "github.com/TomoyaKubota4375/pachimon/backend/internal/battle"

// ClientMessageType はクライアント→サーバーのメッセージ種別。
type ClientMessageType string

const (
	ClientCreateRoom ClientMessageType = "create_room"
	ClientJoinRoom   ClientMessageType = "join_room"
	ClientRejoinRoom ClientMessageType = "rejoin_room"
	ClientSelectMove ClientMessageType = "select_move"
)

// ClientMessage はクライアントから届くWebSocketメッセージ（全フィールドを持つ緩い形。
// typeに応じて使うフィールドが変わる）。
type ClientMessage struct {
	Type ClientMessageType `json:"type"`

	// create_room / join_room
	MonsterID   string `json:"monsterId,omitempty"`
	TrainerName string `json:"trainerName,omitempty"`

	// join_room / rejoin_room
	RoomCode string `json:"roomCode,omitempty"`

	// select_move
	MoveID battle.MoveID `json:"moveId,omitempty"`
}

// ServerMessageType はサーバー→クライアントのメッセージ種別。
type ServerMessageType string

const (
	ServerRoomCreated          ServerMessageType = "room_created"
	ServerWaitingForOpponent   ServerMessageType = "waiting_for_opponent"
	ServerBattleStart          ServerMessageType = "battle_start"
	ServerStateUpdate          ServerMessageType = "state_update"
	ServerOpponentDisconnected ServerMessageType = "opponent_disconnected"
	ServerOpponentReconnected  ServerMessageType = "opponent_reconnected"
	ServerRoomClosed           ServerMessageType = "room_closed"
	ServerError                ServerMessageType = "error"
)

// ServerMessage はサーバーから送るWebSocketメッセージ。
type ServerMessage struct {
	Type ServerMessageType `json:"type"`

	RoomCode string              `json:"roomCode,omitempty"`
	You      battle.PlayerID     `json:"you,omitempty"`
	State    *battle.BattleState `json:"state,omitempty"`
	Message  string              `json:"message,omitempty"`

	// 選択フェーズの締切（unixミリ秒）。0の場合はタイマーなし。
	TurnDeadline int64 `json:"turnDeadline,omitempty"`
}
