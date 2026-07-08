import type {
  BattleState,
  GuardEffect,
  PlayerId,
} from "../../types";

import type { EffectResult } from "./types";
import { createGuardLog } from "../battleLog";

export function applyGuardEffect(
  state: BattleState,
  attackerId: PlayerId,
  effect: GuardEffect
): EffectResult {
  return {
    state: {
      ...state,
      guards: {
        ...state.guards,
        [attackerId]: true,
      },
    },
    logs: [createGuardLog(state[attackerId].monster.name)],
  };
}