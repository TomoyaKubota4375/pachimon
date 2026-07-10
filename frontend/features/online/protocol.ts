// backend/internal/online/messages.go とペアになるメッセージ型。
// フィールド名はそのままJSONのキーとして送受信される。
import type { BattleState, MoveId, PlayerId } from "@/features/battle/types";

export type ClientMessage =
  | { type: "create_room"; monsterId: string; trainerName: string }
  | {
      type: "join_room";
      roomCode: string;
      monsterId: string;
      trainerName: string;
    }
  | { type: "rejoin_room"; roomCode: string }
  | { type: "select_move"; moveId: MoveId };

export type ServerMessage =
  | { type: "room_created"; roomCode: string }
  | { type: "waiting_for_opponent" }
  | {
      type: "battle_start";
      you: PlayerId;
      state: BattleState;
      turnDeadline?: number;
    }
  | { type: "state_update"; state: BattleState; turnDeadline?: number }
  | { type: "opponent_disconnected"; message?: string }
  | { type: "opponent_reconnected" }
  | { type: "room_closed"; message?: string }
  | { type: "error"; message: string };
