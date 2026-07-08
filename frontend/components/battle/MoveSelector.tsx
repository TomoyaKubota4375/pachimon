import { moves } from "@/features/battle/data/moves";
import type {
  BattleMonster,
  MoveId,
  PlayerId,
} from "@/features/battle/types";

type MoveSelectorProps = {
  playerId: PlayerId;
  title: string;
  monster: BattleMonster;
  selectedMoveId: MoveId | null;
  disabled: boolean;
  movePp: Partial<Record<MoveId, number>>;
  onSelectMove: (playerId: PlayerId, moveId: MoveId) => void;
};

export default function MoveSelector({
  playerId,
  title,
  monster,
  selectedMoveId,
  disabled,
  movePp,
  onSelectMove,
}: MoveSelectorProps) {
  return (
    <div className="rounded-2xl border-2 border-white/60 bg-black/70 p-4 text-white shadow-2xl backdrop-blur">
      <h2 className="mb-4 text-lg font-black">{title}</h2>

      <div className="flex flex-col gap-3">
        {monster.moves.slice(0, 3).map((moveId) => {
          const move = moves.find((move) => move.id === moveId);

          if (!move) return null;

          const currentPp = movePp[move.id] ?? 0;

          const isDisabled =
            disabled || selectedMoveId !== null || currentPp <= 0;

          return (
            <button
              key={move.id}
              disabled={isDisabled}
              className="
                rounded-xl border-2 border-white/30 bg-black/40 p-3 text-left
                shadow-lg transition-all duration-150
                hover:-translate-y-1 hover:border-yellow-300 hover:bg-yellow-300/10
                active:translate-y-0 active:scale-95
                disabled:opacity-45
              "
              onClick={() => onSelectMove(playerId, move.id)}
            >
              <div className="text-xl font-black">{move.name}</div>
              <div className="mt-1 text-right text-sm font-bold">
                PP {currentPp} / {move.maxPp}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}