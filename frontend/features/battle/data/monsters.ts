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
    name: "れもん",
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
    name: "らしょうもん",
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
    name: "べあもん",
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
    name: "しもん",
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
    name: "強欲の悪魔  マモン",
    type: TYPES.BLACK,
    imagePath: "/monsters/jamon.png",
    maxHp: 170,
    attack: 27,
    defense: 42,
    speed: 13,
    moves: ["ja-crush", "ja-harden", "ja-poison-fang", "ja-guard"],
  },

  // ===== ここから100体対応の追加分 =====
  // 量産組（65体）はタイプごとの共通技（moves.additions.ts後半）を使い回している。
  // ぶっ壊れ（8体）とボス（7体）は専用技を持つ。

  // ----- BLUE 量産組 -----
  awamon: {
    id: "awamon", name: "アワもん", type: TYPES.BLUE, imagePath: "/monsters/awamon.png",
    maxHp: 118, attack: 32, defense: 27, speed: 28,
    moves: ["mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"],
  },
  takimon: {
    id: "takimon", name: "タキもん", type: TYPES.BLUE, imagePath: "/monsters/takimon.png",
    maxHp: 92, attack: 30, defense: 17, speed: 50,
    moves: ["mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"],
  },
  sangomon: {
    id: "sangomon", name: "サンゴもん", type: TYPES.BLUE, imagePath: "/monsters/sangomon.png",
    maxHp: 148, attack: 25, defense: 41, speed: 15,
    moves: ["mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"],
  },
  kujiramon: {
    id: "kujiramon", name: "クジラもん", type: TYPES.BLUE, imagePath: "/monsters/kujiramon.png",
    maxHp: 105, attack: 41, defense: 22, speed: 32,
    moves: ["mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"],
  },
  takomon: {
    id: "takomon", name: "タコもん", type: TYPES.BLUE, imagePath: "/monsters/takomon.png",
    maxHp: 128, attack: 28, defense: 35, speed: 22,
    moves: ["mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"],
  },
  kaimon: {
    id: "kaimon", name: "カイもん", type: TYPES.BLUE, imagePath: "/monsters/kaimon.png",
    maxHp: 121, attack: 33, defense: 26, speed: 29,
    moves: ["mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"],
  },
  mizutamamon: {
    id: "mizutamamon", name: "ミズタマもん", type: TYPES.BLUE, imagePath: "/monsters/mizutamamon.png",
    maxHp: 95, attack: 29, defense: 18, speed: 52,
    moves: ["mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"],
  },
  samemon: {
    id: "samemon", name: "サメもん", type: TYPES.BLUE, imagePath: "/monsters/samemon.png",
    maxHp: 151, attack: 26, defense: 40, speed: 14,
    moves: ["mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"],
  },
  izumimon: {
    id: "izumimon", name: "イズミもん", type: TYPES.BLUE, imagePath: "/monsters/izumimon.png",
    maxHp: 108, attack: 40, defense: 23, speed: 31,
    moves: ["mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"],
  },
  uzumon: {
    id: "uzumon", name: "ウズもん", type: TYPES.BLUE, imagePath: "/monsters/uzumon.png",
    maxHp: 125, attack: 27, defense: 36, speed: 23,
    moves: ["mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"],
  },
  shiomon: {
    id: "shiomon", name: "シオもん", type: TYPES.BLUE, imagePath: "/monsters/shiomon.png",
    maxHp: 116, attack: 34, defense: 25, speed: 30,
    moves: ["mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"],
  },

  // ----- RED 量産組 -----
  takibimon: {
    id: "takibimon", name: "タキビもん", type: TYPES.RED, imagePath: "/monsters/takibimon.png",
    maxHp: 119, attack: 33, defense: 26, speed: 27,
    moves: ["honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"],
  },
  hibanamon: {
    id: "hibanamon", name: "ヒバナもん", type: TYPES.RED, imagePath: "/monsters/hibanamon.png",
    maxHp: 90, attack: 31, defense: 16, speed: 51,
    moves: ["honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"],
  },
  entotsumon: {
    id: "entotsumon", name: "エントツもん", type: TYPES.RED, imagePath: "/monsters/entotsumon.png",
    maxHp: 150, attack: 24, defense: 42, speed: 13,
    moves: ["honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"],
  },
  yoganmon: {
    id: "yoganmon", name: "ヨウガンもん", type: TYPES.RED, imagePath: "/monsters/yoganmon.png",
    maxHp: 103, attack: 42, defense: 21, speed: 33,
    moves: ["honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"],
  },
  taimatsumon: {
    id: "taimatsumon", name: "タイマツもん", type: TYPES.RED, imagePath: "/monsters/taimatsumon.png",
    maxHp: 126, attack: 29, defense: 34, speed: 21,
    moves: ["honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"],
  },
  konromon: {
    id: "konromon", name: "コンロもん", type: TYPES.RED, imagePath: "/monsters/konromon.png",
    maxHp: 117, attack: 32, defense: 28, speed: 28,
    moves: ["honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"],
  },
  sumibimon: {
    id: "sumibimon", name: "スミビもん", type: TYPES.RED, imagePath: "/monsters/sumibimon.png",
    maxHp: 93, attack: 30, defense: 17, speed: 49,
    moves: ["honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"],
  },
  kazanmon: {
    id: "kazanmon", name: "カザンもん", type: TYPES.RED, imagePath: "/monsters/kazanmon.png",
    maxHp: 153, attack: 25, defense: 43, speed: 12,
    moves: ["honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"],
  },
  hinokomon: {
    id: "hinokomon", name: "ヒノコもん", type: TYPES.RED, imagePath: "/monsters/hinokomon.png",
    maxHp: 106, attack: 43, defense: 20, speed: 34,
    moves: ["honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"],
  },
  danromon: {
    id: "danromon", name: "ダンロもん", type: TYPES.RED, imagePath: "/monsters/danromon.png",
    maxHp: 124, attack: 28, defense: 35, speed: 20,
    moves: ["honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"],
  },
  noroshimon: {
    id: "noroshimon", name: "ノロシもん", type: TYPES.RED, imagePath: "/monsters/noroshimon.png",
    maxHp: 120, attack: 34, defense: 27, speed: 29,
    moves: ["honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"],
  },

  // ----- GREEN 量産組 -----
  happamon: {
    id: "happamon", name: "ハッパもん", type: TYPES.GREEN, imagePath: "/monsters/happamon.png",
    maxHp: 122, attack: 31, defense: 29, speed: 26,
    moves: ["kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"],
  },
  tsubomimon: {
    id: "tsubomimon", name: "ツボミもん", type: TYPES.GREEN, imagePath: "/monsters/tsubomimon.png",
    maxHp: 88, attack: 29, defense: 19, speed: 48,
    moves: ["kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"],
  },
  kinokomon: {
    id: "kinokomon", name: "キノコもん", type: TYPES.GREEN, imagePath: "/monsters/kinokomon.png",
    maxHp: 146, attack: 24, defense: 40, speed: 16,
    moves: ["kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"],
  },
  tsutamon: {
    id: "tsutamon", name: "ツタもん", type: TYPES.GREEN, imagePath: "/monsters/tsutamon.png",
    maxHp: 104, attack: 39, defense: 22, speed: 30,
    moves: ["kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"],
  },
  tanemon: {
    id: "tanemon", name: "タネもん", type: TYPES.GREEN, imagePath: "/monsters/tanemon.png",
    maxHp: 130, attack: 27, defense: 36, speed: 21,
    moves: ["kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"],
  },
  shibamon: {
    id: "shibamon", name: "シバもん", type: TYPES.GREEN, imagePath: "/monsters/shibamon.png",
    maxHp: 119, attack: 32, defense: 28, speed: 27,
    moves: ["kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"],
  },
  hanamon: {
    id: "hanamon", name: "ハナもん", type: TYPES.GREEN, imagePath: "/monsters/hanamon.png",
    maxHp: 91, attack: 30, defense: 18, speed: 47,
    moves: ["kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"],
  },
  morimon: {
    id: "morimon", name: "モリもん", type: TYPES.GREEN, imagePath: "/monsters/morimon.png",
    maxHp: 149, attack: 25, defense: 41, speed: 15,
    moves: ["kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"],
  },
  kokemon: {
    id: "kokemon", name: "コケもん", type: TYPES.GREEN, imagePath: "/monsters/kokemon.png",
    maxHp: 107, attack: 40, defense: 21, speed: 31,
    moves: ["kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"],
  },
  nekkomon: {
    id: "nekkomon", name: "ネッコもん", type: TYPES.GREEN, imagePath: "/monsters/nekkomon.png",
    maxHp: 127, attack: 28, defense: 37, speed: 20,
    moves: ["kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"],
  },
  waramon: {
    id: "waramon", name: "ワラもん", type: TYPES.GREEN, imagePath: "/monsters/waramon.png",
    maxHp: 115, attack: 31, defense: 27, speed: 28,
    moves: ["kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"],
  },

  // ----- WHITE 量産組 -----
  tsukimon: {
    id: "tsukimon", name: "ツキもん", type: TYPES.WHITE, imagePath: "/monsters/tsukimon.png",
    maxHp: 117, attack: 33, defense: 27, speed: 29,
    moves: ["haku-tackle", "haku-focus", "haku-glare", "haku-guard"],
  },
  kumomon: {
    id: "kumomon", name: "クモもん", type: TYPES.WHITE, imagePath: "/monsters/kumomon.png",
    maxHp: 89, attack: 30, defense: 17, speed: 50,
    moves: ["haku-tackle", "haku-focus", "haku-glare", "haku-guard"],
  },
  shiromon: {
    id: "shiromon", name: "シロもん", type: TYPES.WHITE, imagePath: "/monsters/shiromon.png",
    maxHp: 147, attack: 25, defense: 41, speed: 14,
    moves: ["haku-tackle", "haku-focus", "haku-glare", "haku-guard"],
  },
  hanemon: {
    id: "hanemon", name: "ハネもん", type: TYPES.WHITE, imagePath: "/monsters/hanemon.png",
    maxHp: 102, attack: 41, defense: 21, speed: 35,
    moves: ["haku-tackle", "haku-focus", "haku-glare", "haku-guard"],
  },
  mashiromon: {
    id: "mashiromon", name: "マシロもん", type: TYPES.WHITE, imagePath: "/monsters/mashiromon.png",
    maxHp: 129, attack: 27, defense: 35, speed: 22,
    moves: ["haku-tackle", "haku-focus", "haku-glare", "haku-guard"],
  },
  shinjumon: {
    id: "shinjumon", name: "シンジュもん", type: TYPES.WHITE, imagePath: "/monsters/shinjumon.png",
    maxHp: 118, attack: 32, defense: 28, speed: 28,
    moves: ["haku-tackle", "haku-focus", "haku-glare", "haku-guard"],
  },
  yureimon: {
    id: "yureimon", name: "ユウレイもん", type: TYPES.WHITE, imagePath: "/monsters/yureimon.png",
    maxHp: 94, attack: 31, defense: 16, speed: 53,
    moves: ["haku-tackle", "haku-focus", "haku-glare", "haku-guard"],
  },
  tenshimon: {
    id: "tenshimon", name: "テンシもん", type: TYPES.WHITE, imagePath: "/monsters/tenshimon.png",
    maxHp: 144, attack: 26, defense: 39, speed: 17,
    moves: ["haku-tackle", "haku-focus", "haku-glare", "haku-guard"],
  },
  garasumon: {
    id: "garasumon", name: "ガラスもん", type: TYPES.WHITE, imagePath: "/monsters/garasumon.png",
    maxHp: 99, attack: 40, defense: 18, speed: 36,
    moves: ["haku-tackle", "haku-focus", "haku-glare", "haku-guard"],
  },
  kirimon: {
    id: "kirimon", name: "キリもん", type: TYPES.WHITE, imagePath: "/monsters/kirimon.png",
    maxHp: 126, attack: 28, defense: 34, speed: 23,
    moves: ["haku-tackle", "haku-focus", "haku-glare", "haku-guard"],
  },
  shirokumamon: {
    id: "shirokumamon", name: "ほっきょくべあもん", type: TYPES.WHITE, imagePath: "/monsters/shirokumamon.png",
    maxHp: 155, attack: 27, defense: 44, speed: 12,
    moves: ["haku-tackle", "haku-focus", "haku-glare", "haku-guard"],
  },

  // ----- BLACK 量産組 -----
  karasumon: {
    id: "karasumon", name: "カラスもん", type: TYPES.BLACK, imagePath: "/monsters/karasumon.png",
    maxHp: 116, attack: 32, defense: 26, speed: 30,
    moves: ["koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"],
  },
  komorimon: {
    id: "komorimon", name: "でーもん", type: TYPES.BLACK, imagePath: "/monsters/komorimon.png",
    maxHp: 87, attack: 29, defense: 16, speed: 54,
    moves: ["koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"],
  },
  sumimon: {
    id: "sumimon", name: "スミもん", type: TYPES.BLACK, imagePath: "/monsters/sumimon.png",
    maxHp: 150, attack: 24, defense: 42, speed: 13,
    moves: ["koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"],
  },
  yakoumon: {
    id: "yakoumon", name: "ヤコウもん", type: TYPES.BLACK, imagePath: "/monsters/yakoumon.png",
    maxHp: 101, attack: 41, defense: 20, speed: 34,
    moves: ["koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"],
  },
  noroimon: {
    id: "noroimon", name: "ノロイもん", type: TYPES.BLACK, imagePath: "/monsters/noroimon.png",
    maxHp: 124, attack: 28, defense: 35, speed: 22,
    moves: ["koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"],
  },
  akumamon: {
    id: "akumamon", name: "アクマもん", type: TYPES.BLACK, imagePath: "/monsters/akumamon.png",
    maxHp: 121, attack: 34, defense: 27, speed: 27,
    moves: ["koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"],
  },
  kuronekomon: {
    id: "kuronekomon", name: "クロネコもん", type: TYPES.BLACK, imagePath: "/monsters/kuronekomon.png",
    maxHp: 92, attack: 30, defense: 18, speed: 49,
    moves: ["koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"],
  },
  masukumon: {
    id: "masukumon", name: "マスクもん", type: TYPES.BLACK, imagePath: "/monsters/masukumon.png",
    maxHp: 148, attack: 25, defense: 40, speed: 15,
    moves: ["koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"],
  },
  mekakushimon: {
    id: "mekakushimon", name: "メカクシもん", type: TYPES.BLACK, imagePath: "/monsters/mekakushimon.png",
    maxHp: 105, attack: 39, defense: 21, speed: 32,
    moves: ["koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"],
  },
  tasogaremon: {
    id: "tasogaremon", name: "タソガレもん", type: TYPES.BLACK, imagePath: "/monsters/tasogaremon.png",
    maxHp: 123, attack: 27, defense: 36, speed: 21,
    moves: ["koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"],
  },
  shikkokumon: {
    id: "shikkokumon", name: "シッコクもん", type: TYPES.BLACK, imagePath: "/monsters/shikkokumon.png",
    maxHp: 119, attack: 33, defense: 28, speed: 26,
    moves: ["koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"],
  },

  // ----- YELLOW 量産組 -----
  inazumamon: {
    id: "inazumamon", name: "イナズマもん", type: TYPES.YELLOW, imagePath: "/monsters/inazumamon.png",
    maxHp: 112, attack: 34, defense: 25, speed: 35,
    moves: ["denki-tackle", "denki-charge", "denki-shock", "denki-guard"],
  },
  denchimon: {
    id: "denchimon", name: "デンチもん", type: TYPES.YELLOW, imagePath: "/monsters/denchimon.png",
    maxHp: 90, attack: 29, defense: 17, speed: 52,
    moves: ["denki-tackle", "denki-charge", "denki-shock", "denki-guard"],
  },
  raimon: {
    id: "raimon", name: "ライもん", type: TYPES.YELLOW, imagePath: "/monsters/raimon.png",
    maxHp: 142, attack: 26, defense: 39, speed: 18,
    moves: ["denki-tackle", "denki-charge", "denki-shock", "denki-guard"],
  },
  suzumon: {
    id: "suzumon", name: "スズもん", type: TYPES.YELLOW, imagePath: "/monsters/suzumon.png",
    maxHp: 100, attack: 40, defense: 20, speed: 37,
    moves: ["denki-tackle", "denki-charge", "denki-shock", "denki-guard"],
  },
  koudenmon: {
    id: "koudenmon", name: "コウデンもん", type: TYPES.YELLOW, imagePath: "/monsters/koudenmon.png",
    maxHp: 122, attack: 28, defense: 33, speed: 25,
    moves: ["denki-tackle", "denki-charge", "denki-shock", "denki-guard"],
  },
  biribirimon: {
    id: "biribirimon", name: "ビリビリもん", type: TYPES.YELLOW, imagePath: "/monsters/biribirimon.png",
    maxHp: 114, attack: 33, defense: 26, speed: 34,
    moves: ["denki-tackle", "denki-charge", "denki-shock", "denki-guard"],
  },
  hatsudenmon: {
    id: "hatsudenmon", name: "ハツデンもん", type: TYPES.YELLOW, imagePath: "/monsters/hatsudenmon.png",
    maxHp: 93, attack: 30, defense: 18, speed: 50,
    moves: ["denki-tackle", "denki-charge", "denki-shock", "denki-guard"],
  },
  jishakumon: {
    id: "jishakumon", name: "ジシャクもん", type: TYPES.YELLOW, imagePath: "/monsters/jishakumon.png",
    maxHp: 145, attack: 25, defense: 40, speed: 17,
    moves: ["denki-tackle", "denki-charge", "denki-shock", "denki-guard"],
  },
  kaminarimon: {
    id: "kaminarimon", name: "カミナリもん", type: TYPES.YELLOW, imagePath: "/monsters/kaminarimon.png",
    maxHp: 103, attack: 41, defense: 19, speed: 38,
    moves: ["denki-tackle", "denki-charge", "denki-shock", "denki-guard"],
  },
  konsentomon: {
    id: "konsentomon", name: "コンセントもん", type: TYPES.YELLOW, imagePath: "/monsters/konsentomon.png",
    maxHp: 120, attack: 27, defense: 34, speed: 24,
    moves: ["denki-tackle", "denki-charge", "denki-shock", "denki-guard"],
  },

  // ----- ぶっ壊れキャラ（8体・ネタ枠、通常個体より遥かに高stats） -----
  renjimon: {
    id: "renjimon", name: "デンシレンジもん", type: TYPES.RED, imagePath: "/monsters/renjimon.png",
    maxHp: 180, attack: 70, defense: 25, speed: 40,
    moves: ["renji-nuke", "renji-overheat", "honoo-ember", "honoo-guard"],
  },
  wifimon: {
    id: "wifimon", name: "Wi-Fiもん", type: TYPES.YELLOW, imagePath: "/monsters/wifimon.png",
    maxHp: 150, attack: 55, defense: 20, speed: 99,
    moves: ["wifi-lag-spike", "wifi-full-bars", "denki-charge", "denki-guard"],
  },
  shimekirimon: {
    id: "shimekirimon", name: "シメキリもん", type: TYPES.BLACK, imagePath: "/monsters/shimekirimon.png",
    maxHp: 160, attack: 75, defense: 18, speed: 60,
    moves: ["shimekiri-panic", "shimekiri-overtime", "koku-shadow-bite", "koku-guard"],
  },
  energymon: {
    id: "energymon", name: "エナジーもん", type: TYPES.RED, imagePath: "/monsters/energymon.png",
    maxHp: 140, attack: 65, defense: 15, speed: 90,
    moves: ["energy-burst", "energy-overdrive", "honoo-tackle", "honoo-guard"],
  },
  printermon: {
    id: "printermon", name: "プリンターもん", type: TYPES.WHITE, imagePath: "/monsters/printermon.png",
    maxHp: 130, attack: 80, defense: 20, speed: 35,
    moves: ["printer-jam-slam", "printer-double-sided", "haku-focus", "haku-guard"],
  },
  jukenmon: {
    id: "jukenmon", name: "ジュケンもん", type: TYPES.BLACK, imagePath: "/monsters/jukenmon.png",
    maxHp: 120, attack: 72, defense: 15, speed: 25,
    moves: ["juken-desperation", "juken-cram", "koku-shadow-bite", "koku-guard"],
  },
  overclockmon: {
    id: "overclockmon", name: "オーバークロックもん", type: TYPES.YELLOW, imagePath: "/monsters/overclockmon.png",
    maxHp: 110, attack: 68, defense: 12, speed: 95,
    moves: ["overclock-surge", "overclock-boost", "denki-shock", "denki-guard"],
  },
  zangyoumon: {
    id: "zangyoumon", name: "ザンギョウもん", type: TYPES.BLACK, imagePath: "/monsters/zangyoumon.png",
    maxHp: 200, attack: 60, defense: 45, speed: 45,
    moves: ["zangyou-breakdown", "zangyou-endure", "koku-tackle", "koku-guard"],
  },

  // ----- ボスキャラ（7体・各タイプの頂点。専用技3つ＋ガード） -----
  shuenmon: {
    id: "shuenmon", name: "終焉のパチモン", type: TYPES.BLACK, imagePath: "/monsters/shuenmon.png",
    maxHp: 420, attack: 58, defense: 55, speed: 38,
    moves: ["shuen-collapse", "shuen-despair", "shuen-eclipse", "koku-guard"],
  },
  ryumon: {
    id: "ryumon", name: "いにしえのりゅうもん", type: TYPES.BLUE, imagePath: "/monsters/ryumon.png",
    maxHp: 380, attack: 60, defense: 50, speed: 30,
    moves: ["ryu-tidal-crush", "ryu-ancient-roar", "ryu-abyss-breath", "mizu-guard"],
  },
  gokurakuchoumon: {
    id: "gokurakuchoumon", name: "ごくらくちょうもん", type: TYPES.WHITE, imagePath: "/monsters/gokurakuchoumon.png",
    maxHp: 300, attack: 55, defense: 35, speed: 65,
    moves: ["goku-radiant-dive", "goku-wing-gale", "goku-holy-light", "haku-guard"],
  },
  daichiohmon: {
    id: "daichiohmon", name: "だいちのおうもん", type: TYPES.GREEN, imagePath: "/monsters/daichiohmon.png",
    maxHp: 450, attack: 48, defense: 68, speed: 18,
    moves: ["daichi-quake", "daichi-bulwark", "daichi-root-prison", "kusa-guard"],
  },
  kenjamon: {
    id: "kenjamon", name: "ほのおのけんじゃもん", type: TYPES.RED, imagePath: "/monsters/kenjamon.png",
    maxHp: 340, attack: 62, defense: 40, speed: 35,
    moves: ["kenja-inferno", "kenja-flame-mastery", "kenja-cinderstorm", "honoo-guard"],
  },
  raijinmon: {
    id: "raijinmon", name: "らいじんもん", type: TYPES.YELLOW, imagePath: "/monsters/raijinmon.png",
    maxHp: 320, attack: 58, defense: 38, speed: 58,
    moves: ["raijin-thunderstrike", "raijin-overcharge", "raijin-static-field", "denki-guard"],
  },
  yamijoomon: {
    id: "yamijoomon", name: "やみのじょおうもん", type: TYPES.BLACK, imagePath: "/monsters/yamijoomon.png",
    maxHp: 360, attack: 56, defense: 45, speed: 42,
    moves: ["joo-void-strike", "joo-dark-crown", "joo-abyssal-curse", "koku-guard"],
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