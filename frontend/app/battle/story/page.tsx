"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import BattleScreen from "@/components/battle/BattleScreen";
import { createInitialBattleState } from "@/features/battle/data/createInitialBattleState";
import type { MonsterId } from "@/features/battle/data/monsters";

const STORY_ENEMIES: MonsterId[] = [
  "bonmon",
  "kanjimon",
  "hiroyamon",
  "sympathymon",
  "ikarimon",
];

export default function StoryBattlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stage = Number(searchParams.get("stage") ?? "0");

  const enemyId =
    STORY_ENEMIES[stage] ?? STORY_ENEMIES[STORY_ENEMIES.length - 1];

  // モンスター選択画面ができるまで主人公は固定
  const battleState = useMemo(() => {
    return createInitialBattleState("bonmon", enemyId);
  }, [enemyId]);

  return (
    <BattleScreen
      mode="story"
      initialState={battleState}
        onBattleEnd={(result) => {
            if (result.winner === "player1") {
                router.push(`/story?battle=win&stage=${stage}`);
                return;
            }

            router.push(`/story?battle=lose&stage=${stage}`);
        }}
    />
  );
}