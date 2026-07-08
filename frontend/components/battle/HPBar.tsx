"use client";

import { useEffect, useState } from "react";

type HPBarProps = {
  hp: number;
  maxHp: number;
};

export default function HPBar({ hp, maxHp }: HPBarProps) {
  const [displayHp, setDisplayHp] = useState(hp);

  useEffect(() => {
    if (displayHp === hp) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setDisplayHp((current) => {
        if (current === hp) {
          window.clearInterval(intervalId);
          return current;
        }

        const diff = hp - current;
        const step = Math.sign(diff) * Math.max(1, Math.floor(Math.abs(diff) / 8));

        if (Math.abs(diff) <= Math.abs(step)) {
          return hp;
        }

        return current + step;
      });
    }, 30);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hp, displayHp]);

  const percentage = Math.max(0, (displayHp / maxHp) * 100);

  let color = "bg-green-500";
  if (percentage <= 50) color = "bg-yellow-400";
  if (percentage <= 20) color = "bg-red-500";

  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-sm font-black">
        <span>HP</span>
        <span>
          {displayHp} / {maxHp}
        </span>
      </div>

      <div className="h-5 w-full overflow-hidden rounded-full border-2 border-gray-900 bg-gray-300">
        <div
          className={`${color} h-full transition-all duration-300 ${
            percentage <= 20 ? "animate-pulse" : ""
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}