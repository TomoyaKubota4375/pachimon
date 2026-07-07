"use client";

import { useState } from "react";
import { initialBattleState } from "@/features/battle/data/initialBattleState";
import { selectMove } from "@/features/battle/engine/battleEngine";
import type { MoveId } from "@/features/battle/types";
import type { PlayerId } from "@/features/battle/types";
import MoveSelector from "./MoveSelector";
import BattleLog from "./BattleLog";
import MonsterStatus from "./MonsterStatus";

export default function BattleScreen() {
  const [battleState, setBattleState] = useState(initialBattleState);

  const handleSelectMove = (playerId: PlayerId, moveId: MoveId) => {
    setBattleState((current) => selectMove(current, playerId, moveId));
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">ローカルバトル</h1>

      <div className="grid grid-cols-2 gap-8">
        <MonsterStatus player={battleState.player1} />
        <MonsterStatus player={battleState.player2} />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8">
        <MoveSelector
          playerId="player1"
          title="プレイヤー1 技選択"
          selectedMoveId={battleState.selectedMoves.player1}
          disabled={battleState.winner !== null}
          onSelectMove={handleSelectMove}
        />

        <MoveSelector
          playerId="player2"
          title="プレイヤー2 技選択"
          selectedMoveId={battleState.selectedMoves.player2}
          disabled={battleState.winner !== null}
          onSelectMove={handleSelectMove}
        />
      </div>

      {battleState.winner && (
        <div className="mt-8 text-2xl font-bold text-red-600">
          勝者：{battleState[battleState.winner].name}
        </div>
      )}

      <BattleLog logs={battleState.logs} />
    </main>
  );
}