import type {
  BattleState,
  PlayerId,
  StatEffect,
} from "../../types";

import type { EffectResult } from "./types";
import { getOpponentId } from "../getOpponentId";
import { applyStageChange } from "../../mechanics/statStage";
import { createStatChangeLog } from "../battleLog";

function isSuccess(chance: number): boolean {
  return Math.random() * 100 < chance;
}

function getTargetPlayerId(
  attackerId: PlayerId,
  target: "self" | "opponent"
): PlayerId {
  return target === "self" ? attackerId : getOpponentId(attackerId);
}

export function applyStatEffect(
  state: BattleState,
  attackerId: PlayerId,
  effect: StatEffect
): EffectResult {
  if (!isSuccess(effect.chance)) {
    return { state, logs: [] };
  }

  const targetPlayerId = getTargetPlayerId(attackerId, effect.target);
  const targetPlayer = state[targetPlayerId];

  const nextStages = applyStageChange(
    targetPlayer.monster.statStages,
    effect.stat,
    effect.stages
  );

  return {
    state: {
      ...state,
      [targetPlayerId]: {
        ...targetPlayer,
        monster: {
          ...targetPlayer.monster,
          statStages: nextStages,
        },
      },
    },
    logs: [
      createStatChangeLog(
        targetPlayer.monster.name,
        effect.stat,
        effect.stages
      ),
    ],
  };
}