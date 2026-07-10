"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Input } from "pixel-retroui";
import BattleScreen from "@/components/battle/BattleScreen";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { getSelectedMonster } from "@/features/characters/selection";
import { useBattleSocket } from "@/features/online/useBattleSocket";
import type { ServerMessage } from "@/features/online/protocol";
import {
  clearActiveRoomCode,
  getActiveRoomCode,
  saveActiveRoomCode,
} from "@/features/online/roomSession";
import type { BattleState, MoveId, PlayerId } from "@/features/battle/types";

const CHARACTER_SELECT_PATH = `/characters?next=${encodeURIComponent(
  "/battle/online"
)}`;

type Phase =
  | "menu"
  | "creating"
  | "joining"
  | "waiting"
  | "battle"
  | "closed";

export default function OnlineBattlePage() {
  const session = useRequireAuth();

  const [monsterId, setMonsterId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("menu");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [closedMessage, setClosedMessage] = useState<string | null>(null);

  const [youAre, setYouAre] = useState<PlayerId | null>(null);
  const [initialBattleState, setInitialBattleState] =
    useState<BattleState | null>(null);
  const [latestServerState, setLatestServerState] =
    useState<BattleState | null>(null);
  const [turnDeadline, setTurnDeadline] = useState<number | null>(null);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  // ページ再読み込み・回線瞬断からの再接続に使う。stateの再レンダーを待たず
  // 即座に参照したいのでrefにも持たせている
  const pendingRejoinCodeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!session) return;

    const currentMonsterId = getSelectedMonster();

    if (!currentMonsterId) {
      window.location.href = CHARACTER_SELECT_PATH;
      return;
    }

    setMonsterId(currentMonsterId);

    // 直前まで対戦中だった部屋があれば、繋がり次第rejoinする
    const savedRoomCode = getActiveRoomCode();
    if (savedRoomCode) {
      pendingRejoinCodeRef.current = savedRoomCode;
      setPhase("joining");
    }
  }, [session]);

  const handleMessage = useCallback((msg: ServerMessage) => {
    switch (msg.type) {
      case "room_created":
        setRoomCode(msg.roomCode);
        return;

      case "waiting_for_opponent":
        setPhase("waiting");
        return;

      case "battle_start": {
        const activeRoomCode = roomCode ?? pendingRejoinCodeRef.current;
        if (activeRoomCode) {
          saveActiveRoomCode(activeRoomCode);
        }

        setYouAre(msg.you);
        setInitialBattleState(msg.state);
        setLatestServerState(null);
        setTurnDeadline(msg.turnDeadline ?? null);
        setOpponentDisconnected(false);
        setPhase("battle");
        return;
      }

      case "state_update":
        setLatestServerState(msg.state);
        setTurnDeadline(msg.turnDeadline ?? null);
        return;

      case "opponent_disconnected":
        setOpponentDisconnected(true);
        return;

      case "opponent_reconnected":
        setOpponentDisconnected(false);
        return;

      case "room_closed":
        clearActiveRoomCode();
        setClosedMessage(msg.message ?? "対戦が終了しました。");
        setPhase("closed");
        return;

      case "error":
        setErrorMessage(msg.message);
        setPhase((current) => (current === "battle" ? current : "menu"));
        return;
    }
  }, [roomCode]);

  const { status, send } = useBattleSocket(session?.token ?? null, handleMessage);

  // 接続が(再)確立したら、rejoinすべき部屋があれば送る
  const prevStatusRef = useRef(status);
  useEffect(() => {
    const becameOpen = status === "open" && prevStatusRef.current !== "open";
    prevStatusRef.current = status;

    if (!becameOpen) return;

    const codeToRejoin = pendingRejoinCodeRef.current;
    if (codeToRejoin) {
      send({ type: "rejoin_room", roomCode: codeToRejoin });
    }
  }, [status, send]);

  const handleCreateRoom = () => {
    if (!monsterId) return;

    setErrorMessage(null);
    setRoomCode(null);
    setPhase("creating");

    send({
      type: "create_room",
      monsterId,
      trainerName: session?.trainerName ?? "トレーナー",
    });
  };

  const handleJoinRoom = () => {
    const code = roomCodeInput.trim().toUpperCase();

    if (!monsterId || !code) return;

    setErrorMessage(null);
    pendingRejoinCodeRef.current = code;
    setPhase("joining");

    send({
      type: "join_room",
      roomCode: code,
      monsterId,
      trainerName: session?.trainerName ?? "トレーナー",
    });
  };

  const handleSubmitMove = (moveId: MoveId) => {
    send({ type: "select_move", moveId });
  };

  const goHome = () => {
    clearActiveRoomCode();
    window.location.href = "/home";
  };

  if (!session || !monsterId) {
    return null;
  }

  if (phase === "battle" && initialBattleState && youAre) {
    return (
      <>
        <BattleScreen
          mode="online"
          localPlayerId={youAre}
          initialState={initialBattleState}
          serverState={latestServerState}
          turnDeadline={turnDeadline}
          onSubmitMove={handleSubmitMove}
          onBattleEnd={() => {
            clearActiveRoomCode();
            window.location.href = "/home";
          }}
        />

        {opponentDisconnected && (
          <div className="fixed inset-x-0 top-0 z-[9998] bg-red-600 py-2 text-center font-bold text-white">
            相手の接続が切れました。再接続を待っています...
          </div>
        )}

        {status === "reconnecting" && (
          <div className="fixed inset-x-0 top-0 z-[9998] bg-yellow-600 py-2 text-center font-bold text-white">
            サーバーとの接続が切れました。再接続しています...
          </div>
        )}

        {status === "closed" && (
          <div className="fixed inset-x-0 top-0 z-[9998] bg-red-800 py-2 text-center font-bold text-white">
            サーバーと接続できません。ページを再読み込みしてください。
          </div>
        )}
      </>
    );
  }

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-cover bg-center p-10"
      style={{ backgroundImage: "url('/post-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/45"></div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_black]">
          🌐 オンライン対戦
        </h1>

        {(status === "connecting" || status === "reconnecting") && (
          <p className="text-white/80">サーバーに接続中...</p>
        )}

        {status === "closed" && phase !== "closed" && (
          <p className="font-bold text-red-400">
            サーバーとの接続が切れました。ページを再読み込みしてください。
          </p>
        )}

        {phase === "closed" && (
          <Card className="w-[420px] bg-red-100/95 border-4 border-black p-6 text-center">
            <p className="font-bold">{closedMessage}</p>

            <Button
              className="mt-4 w-full bg-gray-700 py-3 font-bold text-white"
              onClick={goHome}
            >
              ホームへ戻る
            </Button>
          </Card>
        )}

        {(phase === "menu" || phase === "creating" || phase === "joining") && (
          <Card className="w-[420px] bg-yellow-200/90 border-4 border-black p-8 text-center">
            {errorMessage && (
              <p className="mb-4 font-bold text-red-600">{errorMessage}</p>
            )}

            <Button
              className="w-full bg-blue-600 py-3 font-bold text-white disabled:opacity-50"
              disabled={status !== "open" || phase === "creating"}
              onClick={handleCreateRoom}
            >
              部屋を作る
            </Button>

            <p className="my-5 text-sm text-gray-700">または</p>

            <Input
              placeholder="部屋コード（例: AB12CD）"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value)}
              className="w-full mb-4"
            />

            <Button
              className="w-full bg-green-600 py-3 font-bold text-white disabled:opacity-50"
              disabled={
                status !== "open" ||
                phase === "joining" ||
                !roomCodeInput.trim()
              }
              onClick={handleJoinRoom}
            >
              部屋に入る
            </Button>
          </Card>
        )}

        {phase === "waiting" && roomCode && (
          <Card className="w-[420px] bg-yellow-200/90 border-4 border-black p-8 text-center">
            <p className="font-bold">この部屋コードを対戦相手に伝えてください</p>

            <p className="my-4 text-5xl font-black tracking-widest">
              {roomCode}
            </p>

            <p className="text-gray-700">対戦相手を待っています...</p>
          </Card>
        )}

        <Button
          className="w-64 bg-gray-700 py-3 font-bold text-white"
          onClick={goHome}
        >
          ホームへ戻る
        </Button>
      </div>
    </main>
  );
}
