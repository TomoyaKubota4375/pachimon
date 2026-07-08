// features/battle/data/monsters.ts に追加するための仮ファイル。
// まだ monsters.ts 本体には取り込んでいない（マージ待ち）。
// 取り込むときは、この中身をそのまま monsters.ts の `monsters` オブジェクトに足して、
// 対応する技(moves.additions.ts側)も features/battle/data/moves.ts にマージしてください。
// imagePathの画像はまだ用意していないプレースホルダーパス。

import type { MonsterData } from "../types";
import { TYPES } from "./types";
import type { MoveAdditionId } from "./moves.additions";

// moves.ts側には自分たちの技がまだ無いので、moves.additions.tsのIDも許可した型で仮チェックする。
// マージ後は本来のMonsterData（MoveIdはmoves.tsのもの）でそのまま通る想定。
type MonsterDataDraft = Omit<MonsterData, "moves"> & {
  moves: MoveAdditionId[];
};

export const monstersAdditions = {
  // ===== BLUE (みず) =====
  shizukumon: {
    id: "shizukumon",
    name: "しずくもん",
    type: TYPES.BLUE,
    imagePath: "/monsters/shizukumon.png",
    maxHp: 115,
    attack: 33,
    defense: 26,
    speed: 30,
    moves: ["shizuku-splash", "shizuku-focus", "shizuku-mist", "shizuku-guard"],
  },

  tsunamon: {
    id: "tsunamon",
    name: "つなもん",
    type: TYPES.BLUE,
    imagePath: "/monsters/tsunamon.png",
    maxHp: 95,
    attack: 30,
    defense: 18,
    speed: 50,
    moves: ["tsuna-rush", "tsuna-accel", "tsuna-splashdown", "tsuna-guard"],
  },

  korimon: {
    id: "korimon",
    name: "こおりもん",
    type: TYPES.BLUE,
    imagePath: "/monsters/korimon.png",
    maxHp: 145,
    attack: 26,
    defense: 40,
    speed: 15,
    moves: ["kori-blow", "kori-harden", "kori-freeze-breath", "kori-guard"],
  },

  // ===== RED (ほのお) =====
  moemon: {
    id: "moemon",
    name: "もえもん",
    type: TYPES.RED,
    imagePath: "/monsters/moemon.png",
    maxHp: 115,
    attack: 34,
    defense: 25,
    speed: 28,
    moves: ["moe-flame", "moe-fired-up", "moe-cinder", "moe-guard"],
  },

  kajimon: {
    id: "kajimon",
    name: "かじもん",
    type: TYPES.RED,
    imagePath: "/monsters/kajimon.png",
    maxHp: 95,
    attack: 32,
    defense: 17,
    speed: 48,
    moves: ["kaji-blaze-dash", "kaji-quickstep", "kaji-spark", "kaji-guard"],
  },

  yakemon: {
    id: "yakemon",
    name: "やけもん",
    type: TYPES.RED,
    imagePath: "/monsters/yakemon.png",
    maxHp: 150,
    attack: 27,
    defense: 42,
    speed: 14,
    moves: ["yake-smolder", "yake-toughen", "yake-scorch", "yake-guard"],
  },

  // ===== GREEN (くさ) =====
  midorimon: {
    id: "midorimon",
    name: "みどりもん",
    type: TYPES.GREEN,
    imagePath: "/monsters/midorimon.png",
    maxHp: 118,
    attack: 32,
    defense: 28,
    speed: 27,
    moves: ["midori-whip", "midori-growth", "midori-thorns", "midori-guard"],
  },

  tsurumon: {
    id: "tsurumon",
    name: "つるもん",
    type: TYPES.GREEN,
    imagePath: "/monsters/tsurumon.png",
    maxHp: 96,
    attack: 31,
    defense: 18,
    speed: 49,
    moves: ["tsuru-strike", "tsuru-vine-dash", "tsuru-bind", "tsuru-guard"],
  },

  mokumon: {
    id: "mokumon",
    name: "もくもん",
    type: TYPES.GREEN,
    imagePath: "/monsters/mokumon.png",
    maxHp: 148,
    attack: 26,
    defense: 41,
    speed: 15,
    moves: ["moku-slam", "moku-bark-up", "moku-spore", "moku-guard"],
  },

  // ===== WHITE (はく) =====
  hikarimon: {
    id: "hikarimon",
    name: "ひかりもん",
    type: TYPES.WHITE,
    imagePath: "/monsters/hikarimon.png",
    maxHp: 116,
    attack: 33,
    defense: 27,
    speed: 29,
    moves: ["hikari-beam", "hikari-focus", "hikari-glare", "hikari-guard"],
  },

  kirakiramon: {
    id: "kirakiramon",
    name: "きらきらもん",
    type: TYPES.WHITE,
    imagePath: "/monsters/kirakiramon.png",
    maxHp: 94,
    attack: 31,
    defense: 17,
    speed: 51,
    moves: ["kira-flash-dash", "kira-shine", "kira-dazzle", "kira-guard"],
  },

  yukimon: {
    id: "yukimon",
    name: "ゆきもん",
    type: TYPES.WHITE,
    imagePath: "/monsters/yukimon.png",
    maxHp: 147,
    attack: 26,
    defense: 41,
    speed: 14,
    moves: ["yuki-blow", "yuki-harden", "yuki-chill", "yuki-guard"],
  },

  // ===== BLACK (こく) =====
  yamimon: {
    id: "yamimon",
    name: "やみもん",
    type: TYPES.BLACK,
    imagePath: "/monsters/yamimon.png",
    maxHp: 117,
    attack: 34,
    defense: 26,
    speed: 28,
    moves: ["yami-strike", "yami-focus", "yami-curse", "yami-guard"],
  },

  kagemon: {
    id: "kagemon",
    name: "かげもん",
    type: TYPES.BLACK,
    imagePath: "/monsters/kagemon.png",
    maxHp: 95,
    attack: 32,
    defense: 17,
    speed: 50,
    moves: ["kage-dash", "kage-slip", "kage-drain", "kage-guard"],
  },

  jamon: {
    id: "jamon",
    name: "じゃもん",
    type: TYPES.BLACK,
    imagePath: "/monsters/jamon.png",
    maxHp: 149,
    attack: 27,
    defense: 42,
    speed: 13,
    moves: ["ja-crush", "ja-harden", "ja-poison-fang", "ja-guard"],
  },
} as const satisfies Record<string, MonsterDataDraft>;

export type MonsterAdditionId = keyof typeof monstersAdditions;
