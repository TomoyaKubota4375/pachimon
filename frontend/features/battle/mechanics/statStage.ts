import type { StatStages, StatName } from "./types";

export function clampStage(stage: number): number {
  return Math.max(-6, Math.min(6, stage));
}

export function getStageMultiplier(stage: number): number {
  if (stage >= 0) {
    return 1 + stage * 0.5;
  }

  return 2 / (2 + Math.abs(stage));
}

export function applyStageChange(
  statStages: StatStages,
  stat: StatName,
  change: number
): StatStages {
  return {
    ...statStages,
    [stat]: clampStage(statStages[stat] + change),
  };
}