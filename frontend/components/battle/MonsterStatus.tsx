"use client";

import { useEffect, useState } from "react";
import type { BattlePlayer } from "@/features/battle/types";
import HPBar from "./HPBar";

type MonsterStatusProps = {
  player: BattlePlayer;
  align?: "left" | "right";
  acting?: boolean;
  damaged?: boolean;
  damageNumber?: number | null;
};

export default function MonsterStatus({
  player,
  align = "left",
  acting = false,
  damaged = false,
  damageNumber = null,
}: MonsterStatusProps) {
  const isRight = align === "right";
  const [idleVariant, setIdleVariant] = useState(0);

  useEffect(() => {
    const changeIdle = () => {
      setIdleVariant(Math.floor(Math.random() * 3));
    };

    changeIdle();

    const intervalId = window.setInterval(() => {
      changeIdle();
    }, 5000 + Math.random() * 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const attackClass = acting
    ? isRight
      ? "-translate-x-24 scale-110"
      : "translate-x-24 scale-110"
    : "";

  const damageClass = damaged ? "scale-95 opacity-80" : "";

  const idleClass = [
    "animate-[idleA_3.5s_ease-in-out_infinite]",
    "animate-[idleB_4.2s_ease-in-out_infinite]",
    "animate-[idleC_3.8s_ease-in-out_infinite]",
  ][idleVariant];

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 z-20 w-[44%] ${
        isRight ? "right-0" : "left-0"
      }`}
    >
      <div
        className={`absolute top-4 w-80 rounded-2xl border-2 border-white/70 bg-black/70 p-4 text-white shadow-2xl backdrop-blur ${
          isRight ? "right-5" : "left-5"
        }`}
      >
        <p className="text-sm font-black text-gray-300">{player.name}</p>
        <h2 className="text-3xl font-black">{player.monster.name}</h2>

        <div className="mt-4">
          <HPBar hp={player.monster.hp} maxHp={player.monster.maxHp} />
        </div>
      </div>

      <div
        className={`absolute bottom-0 flex h-[84vh] w-[34vw] items-end justify-center ${
          isRight ? "right-[15%]" : "left-[15%]"
        }`}
      >
        <div className="absolute bottom-10 h-12 w-72 rounded-full bg-black/40 blur-md" />

        {damageNumber !== null && (
          <div className="absolute top-16 z-40 animate-bounce text-6xl font-black text-red-500 drop-shadow-2xl">
            -{damageNumber}
          </div>
        )}

        {damaged && (
          <div className="absolute inset-0 z-20 rounded-full bg-red-500/30 blur-xl" />
        )}

        <div
          className={`
            relative z-10 flex h-full w-full items-end justify-center
            transition-all duration-300 ease-out
            ${attackClass}
            ${damageClass}
          `}
        >
          <img
            src={player.monster.imagePath}
            alt={player.monster.name}
            className={`
              max-h-full max-w-full object-contain
              drop-shadow-2xl select-none pointer-events-none
              ${idleClass}
            `}
            draggable={false}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes idleA {
          0% {
            transform: translateY(0px) rotate(-1deg) scale(1);
          }
          25% {
            transform: translateY(-2px) rotate(1deg) scale(1.01);
          }
          50% {
            transform: translateY(-5px) rotate(-1deg) scale(0.99);
          }
          75% {
            transform: translateY(-2px) rotate(1deg) scale(1.01);
          }
          100% {
            transform: translateY(0px) rotate(-1deg) scale(1);
          }
        }

        @keyframes idleB {
          0% {
            transform: translateX(0px) scale(1);
          }
          20% {
            transform: translateX(2px) scale(1.01);
          }
          40% {
            transform: translateX(-2px) scale(0.995);
          }
          70% {
            transform: translateX(3px) scale(1.02);
          }
          100% {
            transform: translateX(0px) scale(1);
          }
        }

        @keyframes idleC {
          0% {
            transform: translateY(0px) scale(1);
          }
          15% {
            transform: translateY(-1px) scale(0.99);
          }
          35% {
            transform: translateY(-3px) scale(1.03);
          }
          60% {
            transform: translateY(-2px) scale(0.985);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}