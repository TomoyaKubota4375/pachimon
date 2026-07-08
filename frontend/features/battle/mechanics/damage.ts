import type { BattleMonster } from "../types";
import type { BattleType } from "../data/types";
import { getModifiedStat } from "./statStage";
import { getTypeMultiplier } from "./typeChart";

type CalculateDamageParams = {
  attacker: BattleMonster;
  defender: BattleMonster;
  power: number;
  moveType: BattleType;
};

export type DamageResult = {
  damage: number;
  critical: boolean;
};

function getBurnModifiedAttack(
  attack: number,
  attacker: BattleMonster
): number {
  if (attacker.mainStatus?.condition !== "burn") {
    return attack;
  }

  return Math.max(1, Math.floor(attack / 2));
}

function getStabMultiplier(
  attacker: BattleMonster,
  moveType: BattleType
): number {
  return attacker.type === moveType ? 1.5 : 1;
}

function isCriticalHit(): boolean {
  return Math.random() < 1 / 16;
}

function getCriticalMultiplier(critical: boolean): number {
  return critical ? 1.5 : 1;
}

function getRandomMultiplier(): number {
  return 0.85 + Math.random() * 0.15;
}

export function calculateDamage({
  attacker,
  defender,
  power,
  moveType,
}: CalculateDamageParams): DamageResult {
  if (power <= 0) {
    return {
      damage: 0,
      critical: false,
    };
  }

  const modifiedAttack = getModifiedStat(
    attacker.attack,
    attacker.statStages.attack
  );

  const attack = getBurnModifiedAttack(
    modifiedAttack,
    attacker
  );

  const defense = getModifiedStat(
    defender.defense,
    defender.statStages.defense
  );

  const typeMultiplier = getTypeMultiplier(
    moveType,
    defender.type
  );

  const stabMultiplier = getStabMultiplier(
    attacker,
    moveType
  );

  const critical = isCriticalHit();
  const criticalMultiplier = getCriticalMultiplier(critical);
  const randomMultiplier = getRandomMultiplier();

  const baseDamage = power + attack - defense;
  const damage = Math.max(1, baseDamage);

  return {
    damage: Math.max(
      1,
      Math.floor(
        damage *
          typeMultiplier *
          stabMultiplier *
          criticalMultiplier *
          randomMultiplier
      )
    ),
    critical,
  };
}