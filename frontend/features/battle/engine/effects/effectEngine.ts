import type {
  BattleMove,
  BattleState,
  MoveEffect,
  PlayerId,
} from "../../types";

import type { EffectResult } from "./types";
import { applyDamageEffect } from "./damageEffect";
import { applyStatEffect } from "./statEffect";
import { applyStatusEffect } from "./statusEffect";
import { applyGuardEffect } from "./guardEffect";

function applyEffect(
  state: BattleState,
  attackerId: PlayerId,
  move: BattleMove,
  effect: MoveEffect
): EffectResult {
  switch (effect.type) {
    case "damage":
      return applyDamageEffect(state, attackerId, move, effect);

    case "stat":
      return applyStatEffect(state, attackerId, effect);

    case "status":
      return applyStatusEffect(state, attackerId, effect);

    case "guard":
      return applyGuardEffect(state, attackerId, effect);
  }
}

export function applyMoveEffects(
  state: BattleState,
  attackerId: PlayerId,
  move: BattleMove
): EffectResult {
  let nextState = state;
  const logs: string[] = [];

  for (const effect of move.effects) {
    const result = applyEffect(nextState, attackerId, move, effect);

    nextState = result.state;
    logs.push(...result.logs);
  }

  return {
    state: nextState,
    logs,
  };
}