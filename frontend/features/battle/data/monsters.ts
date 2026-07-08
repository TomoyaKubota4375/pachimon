import type {
  BattleMonster,
  MonsterData,
  StatStages,
} from "../types";
import { TYPES } from "./types";

export const monsters = {
  "pachimon-a": {
    id: "pachimon-a",

    name: "パチモンA",

    type: TYPES.BLUE,

    maxHp: 120,

    attack: 35,
    defense: 20,
    speed: 25,

    moves: [
      "tackle",
      "fire-ball",
      "attack-up",
      "glasses-clean",
      "sudden-side-step",
      "guard",
    ],
  },

  "pachimon-b": {
    id: "pachimon-b",

    name: "パチモンB",

    type: TYPES.RED,

    maxHp: 120,

    attack: 32,
    defense: 22,
    speed: 20,

    moves: [
      "tackle",
      "speed-down",
      "poison-gas",
      "glasses-clean",
      "sudden-side-step",
      "guard",
    ],
  },

  "pachimon-c": {
    id: "pachimon-c",

    name: "パチモンC",

    type: TYPES.GREEN,

    maxHp: 100,

    attack: 30,
    defense: 25,
    speed: 40,

    moves: [
      "tackle",
      "poison-gas",
      "speed-down",
      "guard",
    ],
  },
} as const satisfies Record<string, MonsterData>;

export type MonsterId = keyof typeof monsters;

function createInitialStatStages(): StatStages {
  return {
    attack: 0,
    defense: 0,
    speed: 0,
    accuracy: 0,
    evasion: 0,
  };
}

export function createMonster(id: MonsterId): BattleMonster {
  const monster = monsters[id];

  return {
    ...monster,
    hp: monster.maxHp,
    statStages: createInitialStatStages(),
    mainStatus: null,
    volatileStatus: null,
    moves: [...monster.moves],
  };
}