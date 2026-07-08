import type {
  BattleState,
  MainStatusCondition,
  PlayerId,
  StatusEffect,
  VolatileStatusCondition,
} from "../../types";

import type { EffectResult } from "./types";
import { getOpponentId } from "../getOpponentId";
import {
  createAlreadyMainStatusLog,
  createAlreadyVolatileStatusLog,
  createMainStatusLog,
  createVolatileStatusLog,
} from "../battleLog";

function isSuccess(chance: number): boolean {
  return Math.random() * 100 < chance;
}

function getTargetPlayerId(
  attackerId: PlayerId,
  target: "self" | "opponent"
): PlayerId {
  return target === "self" ? attackerId : getOpponentId(attackerId);
}

function isMainStatusCondition(
  condition: MainStatusCondition | VolatileStatusCondition
): condition is MainStatusCondition {
  return condition !== "confusion";
}

function getSleepTurns(): number {
  return 3;
}

export function applyStatusEffect(
  state: BattleState,
  attackerId: PlayerId,
  effect: StatusEffect
): EffectResult {
  if (!isSuccess(effect.chance)) {
    return { state, logs: [] };
  }

  const targetPlayerId = getTargetPlayerId(attackerId, effect.target);
  const targetPlayer = state[targetPlayerId];
  const targetMonster = targetPlayer.monster;

  if (!isMainStatusCondition(effect.condition)) {
    if (targetMonster.volatileStatus) {
      return {
        state,
        logs: [
          createAlreadyVolatileStatusLog(targetMonster.name),
        ],
      };
    }

    return {
      state: {
        ...state,
        [targetPlayerId]: {
          ...targetPlayer,
          monster: {
            ...targetMonster,
            volatileStatus: {
              condition: effect.condition,
              remainingTurns: 3,
            },
          },
        },
      },
      logs: [
        createVolatileStatusLog(
          targetMonster.name,
          effect.condition
        ),
      ],
    };
  }

  if (targetMonster.mainStatus) {
    return {
      state,
      logs: [
        createAlreadyMainStatusLog(targetMonster.name),
      ],
    };
  }

  return {
    state: {
      ...state,
      [targetPlayerId]: {
        ...targetPlayer,
        monster: {
          ...targetMonster,
          mainStatus: {
            condition: effect.condition,
            remainingTurns:
              effect.condition === "sleep" ? getSleepTurns() : undefined,
            toxicTurnCount:
              effect.condition === "bad-poison" ? 1 : undefined,
          },
        },
      },
    },
    logs: [
      createMainStatusLog(
        targetMonster.name,
        effect.condition
      ),
    ],
  };
}