"use client";

import { Suspense, useEffect, useState } from "react";
import ScreenFade from "@/components/common/ScreenFade";
import { useRouter, useSearchParams } from "next/navigation";

import BattleScreen from "@/components/battle/BattleScreen";
import { createInitialBattleState } from "@/features/battle/data/createInitialBattleState";
import type { MonsterId } from "@/features/battle/data/monsters";
import type { BattleState } from "@/features/battle/types";

import { getSelectedMonster } from "@/features/characters/selection";
import { useRequireAuth } from "@/lib/useRequireAuth";

const STORY_ENEMIES: MonsterId[] = [
  "bonmon",
  "kanjimon",
  "shuenmon",
  "yamijoomon",
  "ryumon",
];

export default function StoryBattlePage() {
  return (
    <Suspense fallback={null}>
      <StoryBattleContent />
    </Suspense>
  );
}

function StoryBattleContent() {
  const session = useRequireAuth();

  const router = useRouter();
  const searchParams = useSearchParams();

  const stage = Number(searchParams.get("stage") ?? "0");
  const [isFading, setIsFading] = useState(true);
  const [battleState, setBattleState] = useState<BattleState | null>(null);

  const enemyId =
    STORY_ENEMIES[stage] ?? STORY_ENEMIES[STORY_ENEMIES.length - 1];

  // sessionStorageはSSR時に存在しないので、render中(useMemo等)ではなく
  // useEffect内でしか読んではいけない
  useEffect(() => {
    const selectedMonster = getSelectedMonster() ?? "bonmon";

    setBattleState(createInitialBattleState(selectedMonster, enemyId));
  }, [enemyId]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsFading(false);
    }, 100);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  // 未ログイン判定・リダイレクト中・初期state準備中は描画しない
  if (!session || !battleState) {
    return null;
  }

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
