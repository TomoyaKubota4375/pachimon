import type { BattleState, PlayerId } from "../types";
import type { MoveId } from "@/features/battle/types";
import { decideActionOrder } from "./decideActionOrder";
import { executeAttack } from "./executeAttack";
import { checkWinner } from "./checkWinner";

export function selectMove(
  state: BattleState,
  playerId: PlayerId,
  moveId: MoveId
): BattleState {
  if (state.phase === "finished") return state;

  const nextState: BattleState = {
    ...state,
    selectedMoves: {
      ...state.selectedMoves,
      [playerId]: moveId,
    },
    logs: [`${state[playerId].name} が技を選択した！`, ...state.logs],
  };

  if (nextState.selectedMoves.player1 && nextState.selectedMoves.player2) {
    return executeTurn(nextState);
  }

  return nextState;
}

export function executeTurn(state: BattleState): BattleState {
  const order = decideActionOrder(state);
  const turnLogs: string[] = [`--- ターン ${state.turn} ---`];

  let nextState = state;

  for (const attackerId of order) {
    const result = executeAttack(nextState, attackerId);

    nextState = result.state;
    turnLogs.push(...result.logs);

    const winner = checkWinner(nextState);

    if (winner) {
      turnLogs.push(`${nextState[winner].name} の勝ち！`);

      return {
        ...nextState,
        phase: "finished",
        winner,
        selectedMoves: {
          player1: null,
          player2: null,
        },
        logs: [...turnLogs, ...nextState.logs],
      };
    }
  }

  return {
    ...nextState,
    turn: nextState.turn + 1,
    selectedMoves: {
      player1: null,
      player2: null,
    },
    logs: [...turnLogs, ...nextState.logs],
  };
}