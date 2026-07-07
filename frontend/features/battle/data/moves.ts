import type { BattleMove } from "../types";
import { TYPES } from "./types";
import type { BattleMove } from "../types";

export const moves = [
  {
    id: "tackle",
    name: "たいあたり",
    type: TYPES.BLUE,
    category: "attack",
    maxPp: 35,
    accuracy: 100,
    priority: 0,
    power: 40,
  },
  {
    id: "fire-ball",
    name: "火の玉",
    type: TYPES.RED,
    category: "attack",
    maxPp: 15,
    accuracy: 85,
    priority: 0,
    power: 60,
    statusEffects: [
      {
        target: "opponent",
        condition: "burn",
        chance: 10,
      },
    ],
  },
  {
    id: "attack-up",
    name: "気合い",
    type: TYPES.WHITE,
    category: "buff",
    maxPp: 20,
    accuracy: 100,
    priority: 0,
    statChanges: [
      {
        target: "self",
        stat: "attack",
        stages: 1,
        chance: 100,
      },
    ],
  },
  {
    id: "speed-down",
    name: "足止め",
    type: TYPES.BLACK,
    category: "debuff",
    maxPp: 20,
    accuracy: 95,
    priority: 0,
    statChanges: [
      {
        target: "opponent",
        stat: "speed",
        stages: -1,
        chance: 100,
      },
    ],
  },
  {
    id: "poison-gas",
    name: "どくガス",
    type: TYPES.GREEN,
    category: "status",
    maxPp: 20,
    accuracy: 90,
    priority: 0,
    statusEffects: [
      {
        target: "opponent",
        condition: "poison",
        chance: 100,
      },
    ],
  },
  {
    id: "guard",
    name: "まもる",
    type: TYPES.WHITE,
    category: "guard",
    maxPp: 10,
    accuracy: 100,
    priority: 4,
  },
] as const satisfies readonly BattleMove[];