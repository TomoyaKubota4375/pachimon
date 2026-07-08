import type {
  BattleMove,
  BattleState,
  DamageEffect,
  PlayerId,
} from "../../types";

import type { EffectResult } from "./types";
import { calculateDamage } from "../../mechanics/damage";
import { getOpponentId } from "../getOpponentId";
import {
  createCriticalLog,
  createDamageLog,
  createGuardSuccessLog,
} from "../battleLog";

export function applyDamageEffect(
  state: BattleState,
  attackerId: PlayerId,
  move: BattleMove,
  effect: DamageEffect
): EffectResult {
  const defenderId = getOpponentId(attackerId);

  const attacker = state[attackerId];
  const defender = state[defenderId];

  if (state.guards[defenderId]) {
    return {
      state,
      logs: [createGuardSuccessLog(defender.monster.name)],
    };
  }

  const damageResult = calculateDamage({
    attacker: attacker.monster,
    defender: defender.monster,
    power: effect.power,
    moveType: move.type,
  });

  const logs: string[] = [];

  if (damageResult.critical) {
    logs.push(createCriticalLog());
  }

  logs.push(
    createDamageLog(
      defender.monster.name,
      damageResult.damage
    )
  );

  return {
    state: {
      ...state,
      [defenderId]: {
        ...defender,
        monster: {
          ...defender.monster,
          hp: Math.max(0, defender.monster.hp - damageResult.damage),
        },
      },
    },
    logs,
  };
}