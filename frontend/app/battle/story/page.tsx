"use client";

import { useEffect, useMemo, useState } from "react";
import ScreenFade from "@/components/common/ScreenFade";
import { useRouter, useSearchParams } from "next/navigation";

import BattleScreen from "@/components/battle/BattleScreen";
import { createInitialBattleState } from "@/features/battle/data/createInitialBattleState";
import type { MonsterId } from "@/features/battle/data/monsters";

import { getSelectedMonster } from "@/features/characters/selection";


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
  const [isFading, setIsFading] = useState(true);

  const enemyId =
    STORY_ENEMIES[stage] ?? STORY_ENEMIES[STORY_ENEMIES.length - 1];

  // モンスター選択画面ができるまで主人公は固定
    const battleState = useMemo(() => {
        const selectedMonster = getSelectedMonster() ?? "bonmon";

        return createInitialBattleState(selectedMonster, enemyId);
    }, [enemyId]);
   
    useEffect(() => {
        const timerId = setTimeout(() => {
            setIsFading(false);
        }, 100);

        return () => {
            clearTimeout(timerId);
        };
    }, []);

    return (
        <>
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

            <ScreenFade active={isFading} />
        </>
    );
}