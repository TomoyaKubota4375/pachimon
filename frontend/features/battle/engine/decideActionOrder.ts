import type { BattleState, PlayerId } from "../types";
import { moves, type MoveId } from "../data/moves";

function getMovePriority(moveId: MoveId | null): number {
  if (!moveId) return 0;

  return moves.find((move) => move.id === moveId)?.priority ?? 0;
}

export function decideActionOrder(state: BattleState): PlayerId[] {
  const player1Priority = getMovePriority(state.selectedMoves.player1);
  const player2Priority = getMovePriority(state.selectedMoves.player2);

  if (player1Priority > player2Priority) {
    return ["player1", "player2"];
  }

  if (player2Priority > player1Priority) {
    return ["player2", "player1"];
  }

  const player1Speed = state.player1.monster.speed;
  const player2Speed = state.player2.monster.speed;

  if (player1Speed >= player2Speed) {
    return ["player1", "player2"];
  }

  return ["player2", "player1"];
}