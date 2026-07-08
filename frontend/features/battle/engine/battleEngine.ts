import type { BattleState, PlayerId } from "../types";
import type { MoveId } from "@/features/battle/types";
import { decideActionOrder } from "./decideActionOrder";
import { executeAttack } from "./executeAttack";
import { checkWinner } from "./checkWinner";
import { canUseMove, consumeMovePp } from "../mechanics/pp";
import { processTurnEnd } from "./turnEndEngine";

export function selectMove(
  state: BattleState,
  playerId: PlayerId,
  moveId: MoveId
): BattleState {
  if (state.phase === "finished") return state;

  if (!canUseMove(state, playerId, moveId)) {
    return {
      ...state,
      logs: [`${state[playerId].name} はその技のPPが足りない！`, ...state.logs],
    };
  }

  const stateAfterPp = consumeMovePp(state, playerId, moveId);

  const nextState: BattleState = {
    ...stateAfterPp,
    selectedMoves: {
      ...stateAfterPp.selectedMoves,
      [playerId]: moveId,
    },
    logs: [
      `${stateAfterPp[playerId].name} が技を選択した！`,
      ...stateAfterPp.logs,
    ],
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

  const stateAfterActions: BattleState = {
    ...nextState,
    turn: nextState.turn + 1,
    selectedMoves: {
      player1: null,
      player2: null,
    },
    guards: {
      player1: false,
      player2: false,
    },
    logs: [...turnLogs, ...nextState.logs],
  };

  return processTurnEnd(stateAfterActions);
}