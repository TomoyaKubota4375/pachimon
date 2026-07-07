import type { BattleMonster } from "../types";
import type { BattleType } from "../data/types";
import { getStageMultiplier } from "./statStage";
import { getTypeMultiplier } from "./typeChart";

type CalculateDamageParams = {
  attacker: BattleMonster;
  defender: BattleMonster;
  power: number;
  moveType: BattleType;
};

export function calculateDamage({
  attacker,
  defender,
  power,
  moveType,
}: CalculateDamageParams) {
  if (power <= 0) return 0;

  const attackMultiplier = getStageMultiplier(attacker.statStages.attack);
  const defenseMultiplier = getStageMultiplier(defender.statStages.defense);

  const attack = attacker.attack * attackMultiplier;
  const defense = defender.defense * defenseMultiplier;

  const typeMultiplier = getTypeMultiplier(moveType, defender.type);

  const baseDamage = power + attack - defense;
  const damage = Math.floor(Math.max(1, baseDamage) * typeMultiplier);

  return Math.max(1, damage);
}