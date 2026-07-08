import { monsters } from "@/features/battle/data/monsters";
import type { CharacterCardData, CharacterMeta } from "../../types";
import { pachimonA } from "./pachimon-a";
import { pachimonB } from "./pachimon-b";

// 新しいキャラを追加するとき:
// 1. このフォルダに roster/<id>.ts を1つ追加して CharacterMeta を export する
// 2. 下の配列に importして並べる
// 3. features/battle/data/monsters.ts 側にも同じidでステータスを追加する（バトル班の作業）
const roster: CharacterMeta[] = [
  pachimonA,
  pachimonB,
];

export const characters: CharacterCardData[] = roster.flatMap((meta) => {
  const monster = monsters[meta.monsterId];

  // monsters.ts側の登録がまだなら選択肢に出さない（データ不整合防止）
  if (!monster) return [];

  return [{
    id: monster.id,
    name: monster.name,
    type: monster.type,
    image: meta.image,
    description: meta.description,
  }];
});
