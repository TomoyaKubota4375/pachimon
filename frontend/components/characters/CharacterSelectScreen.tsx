"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card } from "pixel-retroui";
import { characters } from "@/features/characters/data/roster";
import { saveSelectedMonster } from "@/features/characters/selection";
import CharacterCard from "./CharacterCard";
import EmptyCharacterSlot from "./EmptyCharacterSlot";
import ScreenFade from "@/components/common/ScreenFade";
import { useRequireAuth } from "@/lib/useRequireAuth";

const DEFAULT_NEXT_PATH = "/home";

// 図鑑としての最低表示枠数。まだ埋まっていない分は「未実装」で埋める
const TOTAL_SLOTS = 12;

type CharacterSelectScreenProps = {
  title?: string;
  confirmLabel?: string;
  backPath?: string;
  onConfirm?: (characterId: string) => void;
};

export default function CharacterSelectScreen({
  title = "キャラを選んでください",
  confirmLabel = "このキャラで決定",
  backPath = "/story",
  onConfirm,
}: CharacterSelectScreenProps) {
  const session = useRequireAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next")
    ? decodeURIComponent(searchParams.get("next")!)
    : DEFAULT_NEXT_PATH;

  // マウスhover・キー操作の両方でこのindexを動かして枠を表示する
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [heldIndex, setHeldIndex] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);

  const confirmCharacter = (index: number) => {
      const character = characters[index];
      if (!character) return;

      if (onConfirm) {
          onConfirm(character.id);

          setHeldIndex(null);
          setSelectedIndex(0);

          return;
      }

      saveSelectedMonster(character.id);

      setIsFading(true);

      setTimeout(() => {
          router.push(nextPath);
      }, 500);
  };

  const handleSelectOrConfirm = (index: number) => {
    if (heldIndex === index) {
      confirmCharacter(index);
      return;
    }

    setHeldIndex(index);
  };

  const handleConfirmButton = () => {
    confirmCharacter(heldIndex ?? selectedIndex);
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
        handleSelectOrConfirm(selectedIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, heldIndex, nextPath]);

  const emptySlotCount = Math.max(TOTAL_SLOTS - characters.length, 0);

  // 未ログイン判定 or リダイレクト中は描画しない
  if (!session) {
    return null;
  }

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-cover bg-center p-10"
      style={{ backgroundImage: "url('/post-bg.png')" }}
    >
      <ScreenFade active={isFading} />

      <button
        onClick={() => router.push(backPath)}
        className="absolute left-6 top-6 z-20 rounded-xl border-2 border-white bg-black/70 px-5 py-3 font-bold text-white hover:bg-white hover:text-black"
      >
        ← ストーリーに戻る
      </button>

      {/* 背景を暗くする（contentより手前に来ないようz-10より下に置く） */}
      <div className="absolute inset-0 bg-black/45"></div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_black]">
          {title}
        </h1>
        <p className="text-xl text-white/90">
          使う「もん」を選んでください
        </p>

        <Button
          className="w-64 bg-blue-600 py-3 text-xl font-bold text-white"
          onClick={handleConfirmButton}
        >
          {confirmLabel}
        </Button>

        <Card className="w-full max-w-7xl bg-yellow-200/90 border-4 border-black p-8">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {characters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                selected={index === selectedIndex || index === heldIndex}
                onSelect={() => handleSelectOrConfirm(index)}
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
          onClick={handleConfirmButton}
        >
          {confirmLabel}
        </Button>
      </div>
    </main>
  );
}
