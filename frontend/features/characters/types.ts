import type { BattleType } from "@/features/battle/data/types";
import type { MonsterId } from "@/features/battle/data/monsters";

export type { MonsterId };

// カード表示に必要な情報（features/battle/data/monsters.ts から自動生成する）
export type CharacterCardData = {
  id: MonsterId;
  name: string;
  type: BattleType;
  image: string;
};
