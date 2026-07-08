import type { BattleState, PlayerId, MoveId } from "../types";
import { moves } from "../data/moves";
import { getModifiedStat } from "../mechanics/statStage";

function getMovePriority(moveId: MoveId | null): number {
  if (!moveId) {
    return 0;
  }

  const move = moves.find((move) => move.id === moveId);

  return move?.priority ?? 0;
}

function getBattleSpeed(
  state: BattleState,
  playerId: PlayerId
): number {
  const monster = state[playerId].monster;

  const modifiedSpeed = getModifiedStat(
    monster.speed,
    monster.statStages.speed
  );

  if (monster.mainStatus?.condition === "paralysis") {
    return Math.max(1, Math.floor(modifiedSpeed / 2));
  }

  return modifiedSpeed;
}

export function decideActionOrder(
  state: BattleState
): PlayerId[] {
  const player1Priority = getMovePriority(
    state.selectedMoves.player1
  );

  const player2Priority = getMovePriority(
    state.selectedMoves.player2
  );

  if (player1Priority > player2Priority) {
    return ["player1", "player2"];
  }

  if (player2Priority > player1Priority) {
    return ["player2", "player1"];
  }

  const player1Speed = getBattleSpeed(state, "player1");
  const player2Speed = getBattleSpeed(state, "player2");

  if (player1Speed > player2Speed) {
    return ["player1", "player2"];
  }

  if (player2Speed > player1Speed) {
    return ["player2", "player1"];
  }

  return Math.random() < 0.5
    ? ["player1", "player2"]
    : ["player2", "player1"];
}