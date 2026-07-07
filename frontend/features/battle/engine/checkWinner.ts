import type { BattleState, PlayerId } from "../types";

export function checkWinner(state: BattleState): PlayerId | null {
  if (state.player1.monster.hp <= 0) {
    return "player2";
  }

  if (state.player2.monster.hp <= 0) {
    return "player1";
  }

  return null;
}