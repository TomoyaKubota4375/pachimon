import type { BattleMonster } from "../types";
import { TYPES } from "./types";

export const monsters: Record<string, BattleMonster> = {
  "pachimon-a": {
    id: "pachimon-a",

    name: "パチモンA",

    type: TYPES.BLUE,

    hp: 120,
    maxHp: 120,

    attack: 35,
    defense: 20,
    speed: 25,

    statStages: {
      attack: 0,
      defense: 0,
      speed: 0,
    },

    mainStatus: null,
    volatileStatus: null,

    moves: [
      "tackle",
      "fire-ball",
      "attack-up",
      "guard",
    ],
  },

  "pachimon-b": {
    id: "pachimon-b",

    name: "パチモンB",

    type: TYPES.RED,

    hp: 120,
    maxHp: 120,

    attack: 32,
    defense: 22,
    speed: 20,

    statStages: {
      attack: 0,
      defense: 0,
      speed: 0,
    },

    mainStatus: null,
    volatileStatus: null,

    moves: [
      "tackle",
      "speed-down",
      "poison-gas",
      "guard",
    ],
  },
};