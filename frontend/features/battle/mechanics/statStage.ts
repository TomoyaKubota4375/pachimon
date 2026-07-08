import type { StatName, StatStages } from "../types";

const MIN_STAGE = -6;
const MAX_STAGE = 6;

function clampStage(stage: number): number {
  return Math.max(MIN_STAGE, Math.min(MAX_STAGE, stage));
}

export function applyStageChange(
  statStages: StatStages,
  stat: StatName,
  stages: number
): StatStages {
  return {
    ...statStages,
    [stat]: clampStage(statStages[stat] + stages),
  };
}

export function getModifiedStat(
  baseStat: number,
  stage: number
): number {
  if (stage >= 0) {
    return Math.floor(baseStat * ((2 + stage) / 2));
  }

  return Math.floor(baseStat * (2 / (2 + Math.abs(stage))));
}

export function getAccuracyMultiplier(stage: number): number {
  if (stage >= 0) {
    return (3 + stage) / 3;
  }

  return 3 / (3 + Math.abs(stage));
}