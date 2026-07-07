import { moves } from "@/features/battle/data/moves";
import type { MoveId, PlayerId } from "@/features/battle/types";

type MoveSelectorProps = {
  playerId: PlayerId;
  title: string;
  selectedMoveId: MoveId | null;
  disabled: boolean;
  onSelectMove: (playerId: PlayerId, moveId: MoveId) => void;
};

export default function MoveSelector({
  playerId,
  title,
  selectedMoveId,
  disabled,
  onSelectMove,
}: MoveSelectorProps) {
  return (
    <div>
      <h2 className="font-bold mb-2">{title}</h2>

      <div className="flex flex-wrap gap-2">
        {moves.map((move) => (
          <button
            key={move.id}
            disabled={disabled || selectedMoveId !== null}
            className="border px-4 py-2 rounded disabled:opacity-50"
            onClick={() => onSelectMove(playerId, move.id)}
          >
            {move.name}
          </button>
        ))}
      </div>

      <p className="mt-2 text-sm text-gray-600">
        選択：{selectedMoveId ?? "未選択"}
      </p>
    </div>
  );
}