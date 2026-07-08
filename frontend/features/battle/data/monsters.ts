import type {
  BattleMonster,
  MonsterData,
  StatStages,
} from "../types";
import { TYPES } from "./types";

export const monsters = {
  bonmon: {
    id: "bonmon",
    name: "ぼんもん",
    type: TYPES.WHITE,
    imagePath: "/monsters/bonmon.png",
    maxHp: 105,
    attack: 30,
    defense: 22,
    speed: 45,
    moves: ["bon-quick-hit", "bon-speed-up", "bon-flash"],
  },

  kanjimon: {
    id: "kanjimon",
    name: "かんじもん",
    type: TYPES.BLUE,
    imagePath: "/monsters/kanjimon.png",
    maxHp: 110,
    attack: 32,
    defense: 24,
    speed: 34,
    moves: ["kanji-wave", "kanji-dodge", "kanji-blur"],
  },

  hiroyamon: {
    id: "hiroyamon",
    name: "ひろやもん",
    type: TYPES.GREEN,
    imagePath: "/monsters/hiroyamon.png",
    maxHp: 135,
    attack: 28,
    defense: 38,
    speed: 20,
    moves: ["hiroya-static", "hiroya-guard-up", "hiroya-paralyze"],
  },

  sympathymon: {
    id: "sympathymon",
    name: "シンパシーもん",
    type: TYPES.BLACK,
    imagePath: "/monsters/sympathymon.png",
    maxHp: 115,
    attack: 31,
    defense: 25,
    speed: 30,
    moves: ["sympathy-pressure", "sympathy-slow", "sympathy-dark-hit"],
  },

  ikarimon: {
    id: "ikarimon",
    name: "いかりもん",
    type: TYPES.RED,
    imagePath: "/monsters/ikarimon.png",
    maxHp: 125,
    attack: 42,
    defense: 24,
    speed: 16,
    moves: ["ikari-power-up", "ikari-heavy-blow", "ikari-burn"],
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