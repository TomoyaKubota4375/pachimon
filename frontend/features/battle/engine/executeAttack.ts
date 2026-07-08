import type { BattleState, PlayerId, MoveId } from "../types";
import { moves } from "../data/moves";
import { applyMoveEffects } from "./effects/effectEngine";
import { canAct } from "./actionEngine";
import { getOpponentId } from "./getOpponentId";
import { getAccuracyMultiplier } from "../mechanics/statStage";

function getMove(moveId: MoveId) {
  return moves.find((move) => move.id === moveId);
}

function isMoveHit(accuracy: number): boolean {
  return Math.random() * 100 < accuracy;
}

type ExecuteAttackResult = {
  state: BattleState;
  logs: string[];
};

export function executeAttack(
  state: BattleState,
  attackerId: PlayerId
): ExecuteAttackResult {
  const moveId = state.selectedMoves[attackerId];
  const logs: string[] = [];

  if (!moveId) {
    return { state, logs };
  }

  const attacker = state[attackerId];
  const defenderId = getOpponentId(attackerId);
  const defender = state[defenderId];

  const move = getMove(moveId);

  if (!move) {
    logs.push("技が見つかりません！");
    return { state, logs };
  }

  if (attacker.monster.hp <= 0) {
    logs.push(`${attacker.monster.name} は倒れていて動けない！`);
    return { state, logs };
  }

  const actionResult = canAct(state, attackerId);

  if (!actionResult.canAct) {
    return {
      state: actionResult.state,
      logs: actionResult.logs,
    };
  }

  state = actionResult.state;

  logs.push(`${attacker.monster.name} の ${move.name}！`);

  const accuracyMultiplier = getAccuracyMultiplier(
    attacker.monster.statStages.accuracy
  );

  const evasionMultiplier = getAccuracyMultiplier(
    defender.monster.statStages.evasion
  );

  const finalAccuracy =
    move.accuracy *
    (accuracyMultiplier / evasionMultiplier);

  if (!isMoveHit(finalAccuracy)) {
    logs.push(`${attacker.monster.name} の攻撃は外れた！`);

    return {
      state,
      logs,
    };
  }

  const result = applyMoveEffects(
    state,
    attackerId,
    move
  );

  return {
    state: result.state,
    logs: [...logs, ...result.logs],
  };
}