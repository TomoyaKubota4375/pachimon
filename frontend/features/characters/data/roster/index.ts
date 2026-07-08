import { monsters } from "@/features/battle/data/monsters";
import type { CharacterCardData } from "../../types";

// features/battle/data/monsters.ts に登録されているモンスターをそのままキャラ選択肢にする。
// 新しいモンスターはバトル側にさえ追加されれば、ここは何もしなくても自動で反映される。
export const characters: CharacterCardData[] = Object.values(monsters).map(
  (monster) => ({
    id: monster.id,
    name: monster.name,
    type: monster.type,
    image: monster.imagePath,
  })
);
