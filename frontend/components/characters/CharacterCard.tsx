"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import type { CharacterCardData } from "@/features/characters/types";

const TYPE_LABELS: Record<string, string> = {
  blue: "みず",
  red: "ほのお",
  green: "くさ",
  yellow: "でんき",
  white: "はく",
  black: "こく",
};

const TYPE_COLORS: Record<string, string> = {
  blue: "bg-blue-500 text-white",
  red: "bg-red-500 text-white",
  green: "bg-green-500 text-black",
  yellow: "bg-yellow-400 text-black",
  white: "bg-gray-100 text-black",
  black: "bg-gray-800 text-white",
};

type CharacterCardProps = {
  character: CharacterCardData;
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
};

export default function CharacterCard({
  character,
  selected,
  onSelect,
  onHover,
}: CharacterCardProps) {
  const [imageError, setImageError] = useState(false);

  // pixel-retroui のCSSがレイヤー外（unlayered）で button/* に
  // border・background-color・--tw-scale-x 等をリセットしており、
  // Tailwindのユーティリティクラス（レイヤー内）が優先度に関係なく負けてしまう。
  // このカードの見た目はinline styleで直接指定して確実に反映させる。
  const cardStyle: CSSProperties = selected
    ? {
        borderWidth: 4,
        borderStyle: "solid",
        borderColor: "#2563eb",
        backgroundColor: "#ffffff",
        boxShadow: "0 0 0 4px #93c5fd",
        transform: "scale(1.05)",
      }
    : {
        borderWidth: 4,
        borderStyle: "solid",
        borderColor: "#000000",
        backgroundColor: "rgba(255,255,255,0.5)",
      };

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHover}
      style={cardStyle}
      className="flex aspect-[3/4] flex-col items-center gap-2 rounded-lg p-3 text-center transition"
    >
      <div
        style={{ borderWidth: 2, borderStyle: "solid", borderColor: "#000000" }}
        className="relative h-20 w-20 overflow-hidden rounded-md bg-white"
      >
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-gray-400">
            {character.name.charAt(0)}
          </div>
        ) : (
          <Image
            src={character.image}
            alt={character.name}
            fill
            sizes="96px"
            className="object-contain"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <p className="font-bold">{character.name}</p>

      <span
        className={`rounded px-2 py-0.5 text-xs font-bold ${TYPE_COLORS[character.type] ?? "bg-gray-300"}`}
      >
        {TYPE_LABELS[character.type] ?? character.type}
      </span>
    </button>
  );
}
