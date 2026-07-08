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
    <div>
      <h2 className="font-bold mb-2">{title}</h2>

      <div className="flex flex-wrap gap-2">
        {monster.moves.map((moveId) => {
          const move = moves.find((move) => move.id === moveId);

          if (!move) {
            return null;
          }

          const currentPp = movePp[move.id] ?? 0;

          const isDisabled =
            disabled ||
            selectedMoveId !== null ||
            currentPp <= 0;

          return (
            <button
              key={move.id}
              disabled={isDisabled}
              className="border px-4 py-2 rounded disabled:opacity-50"
              onClick={() =>
                onSelectMove(playerId, move.id)
              }
            >
              {move.name} PP {currentPp} / {move.maxPp}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-sm text-gray-600">
        選択：{selectedMoveId ?? "未選択"}
      </p>
    </div>
  );
}