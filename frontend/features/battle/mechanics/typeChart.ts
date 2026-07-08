import type { BattleType } from "../data/types";
import { TYPES } from "../data/types";

export function getTypeMultiplier(
  attackType: BattleType,
  defenseType: BattleType
): number {
  if (attackType === defenseType) {
    return 1;
  }

  if (
    (attackType === TYPES.BLUE && defenseType === TYPES.RED) ||
    (attackType === TYPES.RED && defenseType === TYPES.GREEN) ||
    (attackType === TYPES.GREEN && defenseType === TYPES.BLUE) ||
    (attackType === TYPES.WHITE && defenseType === TYPES.BLACK) ||
    (attackType === TYPES.BLACK && defenseType === TYPES.WHITE)
  ) {
    return 2.0;
  }

  if (
    (attackType === TYPES.RED && defenseType === TYPES.BLUE) ||
    (attackType === TYPES.GREEN && defenseType === TYPES.RED) ||
    (attackType === TYPES.BLUE && defenseType === TYPES.GREEN)
  ) {
    return 0.5;
  }

  return 1;
}