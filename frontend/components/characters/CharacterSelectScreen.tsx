"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card } from "pixel-retroui";
import { characters } from "@/features/characters/data/roster";
import { saveSelectedMonster } from "@/features/characters/selection";
import CharacterCard from "./CharacterCard";
import EmptyCharacterSlot from "./EmptyCharacterSlot";
import ScreenFade from "@/components/common/ScreenFade";

const DEFAULT_NEXT_PATH = "/home";

// 図鑑としての最低表示枠数。まだ埋まっていない分は「未実装」で埋める
const TOTAL_SLOTS = 12;

export default function CharacterSelectScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next")
    ? decodeURIComponent(searchParams.get("next")!)
    : DEFAULT_NEXT_PATH;

  // マウスhover・キー操作の両方でこのindexを動かして枠を表示する
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const handleConfirm = () => {
    const character = characters[selectedIndex];
    if (!character) return;

    saveSelectedMonster(character.id);
    setIsFading(true);

    setTimeout(() => {
      router.push(nextPath);
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        setSelectedIndex((current) => Math.min(current + 1, characters.length - 1));
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        setSelectedIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === "Enter") {
        event.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, nextPath]);

  const emptySlotCount = Math.max(TOTAL_SLOTS - characters.length, 0);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-cover bg-center p-10"
      style={{ backgroundImage: "url('/post-bg.png')" }}
    >
      <ScreenFade active={isFading} />

      <button
        onClick={() => router.push("/story")}
        className="absolute left-6 top-6 z-20 rounded-xl border-2 border-white bg-black/70 px-5 py-3 font-bold text-white hover:bg-white hover:text-black"
      >
        ← ストーリーに戻る
      </button>

      {/* 背景を暗くする（contentより手前に来ないようz-10より下に置く） */}
      <div className="absolute inset-0 bg-black/45"></div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_black]">
          キャラを選んでください
        </h1>

        <Card className="w-full max-w-4xl bg-yellow-200/90 border-4 border-black p-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {characters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                selected={index === selectedIndex}
                onSelect={() => setSelectedIndex(index)}
                onHover={() => setSelectedIndex(index)}
              />
            ))}

            {Array.from({ length: emptySlotCount }).map((_, index) => (
              <EmptyCharacterSlot key={`empty-${index}`} />
            ))}
          </div>
        </Card>

        <Button
          className="w-64 bg-blue-600 py-3 text-xl font-bold text-white"
          onClick={handleConfirm}
        >
          このキャラで決定
        </Button>
      </div>
    </main>
  );
}
