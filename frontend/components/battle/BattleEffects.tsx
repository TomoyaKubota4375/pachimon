import type { BattleEffectAnimation } from "@/features/battle/types";

type BattleEffectsProps = {
  animation: BattleEffectAnimation | null;
  targetSide: "left" | "right" | null;
};

function getEffectLabel(animation: BattleEffectAnimation): string {
  switch (animation) {
    case "red-attack":
      return "🔥";
    case "blue-attack":
      return "💧";
    case "yellow-attack":
      return "⚡";
    case "white-attack":
      return "✨";
    case "black-attack":
      return "🌑";
    case "normal-attack":
      return "💥";
    case "buff":
      return "⬆️";
    case "debuff":
      return "⬇️";
    case "status":
      return "🌀";
    case "guard":
      return "🛡️";
  }
}

export default function BattleEffects({
  animation,
  targetSide,
}: BattleEffectsProps) {
  if (!animation || !targetSide) {
    return null;
  }

  const label = getEffectLabel(animation);
  const positionClass = targetSide === "left" ? "left-1/4" : "left-3/4";

  return (
    <div
      className={`pointer-events-none absolute top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 ${positionClass}`}
    >
      <div className="animate-ping text-8xl drop-shadow-2xl">{label}</div>
      <div className="absolute inset-0 animate-bounce text-7xl drop-shadow-2xl">
        {label}
      </div>
    </div>
  );
}