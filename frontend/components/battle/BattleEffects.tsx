import type { BattleEffectAnimation, PlayerId } from "@/features/battle/types";

type BattleEffectsProps = {
  animation: BattleEffectAnimation | null;
  targetPlayerId: PlayerId | null;
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
  targetPlayerId,
}: BattleEffectsProps) {
  if (!animation || !targetPlayerId) {
    return null;
  }

  const label = getEffectLabel(animation);
  const positionClass =
    targetPlayerId === "player1" ? "left-1/4" : "left-3/4";

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