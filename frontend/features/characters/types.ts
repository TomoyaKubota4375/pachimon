import type { BattleType } from "@/features/battle/data/types";

// バトル側のモンスターIDをそのまま使う（キャラ = モンスター）
export type MonsterId = string;

// 1キャラぶんの「選択画面用」メタデータ
// バトルのステータス（hp/attack等）はfeatures/battle側が正なので持たない
export type CharacterMeta = {
  monsterId: MonsterId;
  image: string;
  description: string;
};

// カード表示に必要な情報をまとめたもの（monsters.tsとCharacterMetaの合成結果）
export type CharacterCardData = {
  id: MonsterId;
  name: string;
  type: BattleType;
  image: string;
  description: string;
};
