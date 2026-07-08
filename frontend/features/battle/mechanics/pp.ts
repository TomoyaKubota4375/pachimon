import type { BattleState, MoveId, PlayerId } from "../types";

export function getMovePp(
  state: BattleState,
  playerId: PlayerId,
  moveId: MoveId
): number {
  return state.movePp[playerId][moveId] ?? 0;
}

export function canUseMove(
  state: BattleState,
  playerId: PlayerId,
  moveId: MoveId
): boolean {
  return getMovePp(state, playerId, moveId) > 0;
}

export function consumeMovePp(
  state: BattleState,
  playerId: PlayerId,
  moveId: MoveId
): BattleState {
  const currentPp = getMovePp(state, playerId, moveId);

  return {
    ...state,
    movePp: {
      ...state.movePp,
      [playerId]: {
        ...state.movePp[playerId],
        [moveId]: Math.max(0, currentPp - 1),
      },
    },
  };
}