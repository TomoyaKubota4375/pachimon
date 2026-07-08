import type { BattleMove } from "../types";
import { TYPES } from "./types";

export const moves = [
  {
    id: "tackle",
    name: "たいあたり",
    type: TYPES.BLUE,
    maxPp: 35,
    accuracy: 100,
    priority: 0,
    effects: [{ type: "damage", power: 40 }],
  },
  {
    id: "fire-ball",
    name: "火の玉",
    type: TYPES.RED,
    maxPp: 15,
    accuracy: 85,
    priority: 0,
    effects: [
      { type: "damage", power: 60 },
      {
        type: "status",
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
    maxPp: 20,
    accuracy: 100,
    priority: 0,
    effects: [
      {
        type: "stat",
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
    maxPp: 20,
    accuracy: 95,
    priority: 0,
    effects: [
      {
        type: "stat",
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
    maxPp: 20,
    accuracy: 90,
    priority: 0,
    effects: [
      {
        type: "status",
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
    maxPp: 10,
    accuracy: 100,
    priority: 4,
    effects: [{ type: "guard" }],
  },
  {
    id: "glasses-clean",
    name: "メガネ拭き",
    type: TYPES.WHITE,
    maxPp: 20,
    accuracy: 100,
    priority: 0,
    effects: [
      {
        type: "stat",
        target: "self",
        stat: "accuracy",
        stages: 1,
        chance: 100,
      },
    ],
  },
  {
    id: "sudden-side-step",
    name: "急に反復横跳び",
    type: TYPES.GREEN,
    maxPp: 20,
    accuracy: 100,
    priority: 0,
    effects: [
      {
        type: "stat",
        target: "self",
        stat: "evasion",
        stages: 1,
        chance: 100,
      },
    ],
  },
] as const satisfies readonly BattleMove[];

export type MoveId = (typeof moves)[number]["id"];