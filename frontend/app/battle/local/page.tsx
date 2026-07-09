"use client";

import { useState } from "react";
import BattleScreen from "@/components/battle/BattleScreen";
import CharacterSelectScreen from "@/components/characters/CharacterSelectScreen";
import { createInitialBattleState } from "@/features/battle/data/createInitialBattleState";

type Phase = "select" | "battle";
type SelectPlayer = "player1" | "player2";

type MonsterId = Parameters<typeof createInitialBattleState>[0];
type InitialBattleState = ReturnType<typeof createInitialBattleState>;

export default function LocalBattlePage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectPlayer, setSelectPlayer] = useState<SelectPlayer>("player1");
  const [player1MonsterId, setPlayer1MonsterId] = useState<MonsterId | null>(null);
  const [battleState, setBattleState] = useState<InitialBattleState | null>(null);

  const handleConfirmCharacter = (monsterId: string) => {
        console.log(
        "現在:",
        selectPlayer,
        "選択:",
        monsterId,
    );

    const selectedMonsterId = monsterId as MonsterId;

    if (selectPlayer === "player1") {
      setPlayer1MonsterId(selectedMonsterId);
      setSelectPlayer("player2");
      return;
    }

    if (!player1MonsterId) return;

    const initialState = createInitialBattleState(
      player1MonsterId,
      selectedMonsterId,
    );

    console.log(initialState.player1.monster.id);
    console.log(initialState.player2.monster.id);

    setBattleState(initialState);
    setPhase("battle");
  };

  const handleBattleEnd = () => {
    setPhase("select");
    setSelectPlayer("player1");
    setPlayer1MonsterId(null);
    setBattleState(null);
  };

  if (phase === "battle" && battleState) {
    return (
      <BattleScreen
        mode="local"
        initialState={battleState}
        onBattleEnd={handleBattleEnd}
      />
    );
  }

  return (
    <CharacterSelectScreen
      title={
        selectPlayer === "player1"
          ? "Player1 のモンスターを選んでください"
          : "Player2 のモンスターを選んでください"
      }
      confirmLabel={
        selectPlayer === "player1"
          ? "Player1 決定"
          : "Player2 決定"
      }
      backPath="/home"
      onConfirm={handleConfirmCharacter}
    />
  );
}