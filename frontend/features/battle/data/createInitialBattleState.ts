import type { BattleState, PlayerId } from "../types";
import type { MoveId } from "./moves";
import { moves } from "./moves";
import {
  createMonster,
  monsters,
  type MonsterId,
} from "./monsters";

function createMovePp(
  moveIds: MoveId[]
): Partial<Record<MoveId, number>> {
  const movePp: Partial<Record<MoveId, number>> = {};

  for (const moveId of moveIds) {
    const move = moves.find((move) => move.id === moveId);

    if (move) {
      movePp[moveId] = move.maxPp;
    }
  }

  return movePp;
}

export function createInitialBattleState(
  player1MonsterId: MonsterId,
  player2MonsterId: MonsterId
): BattleState {
  const player1Monster = createMonster(player1MonsterId);
  const player2Monster = createMonster(player2MonsterId);

  return {
    turn: 1,
    phase: "selecting",

    player1: {
      id: "player1" as PlayerId,
      name: "プレイヤー1",
      monster: player1Monster,
    },

    player2: {
      id: "player2" as PlayerId,
      name: "プレイヤー2",
      monster: player2Monster,
    },

    selectedMoves: {
      player1: null,
      player2: null,
    },

    guards: {
      player1: false,
      player2: false,
    },

    movePp: {
      player1: createMovePp(player1Monster.moves),
      player2: createMovePp(player2Monster.moves),
    },

    logs: ["バトル開始！"],
    winner: null,
  };
}