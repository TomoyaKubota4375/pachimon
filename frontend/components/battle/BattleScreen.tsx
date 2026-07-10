"use client";

import { useEffect, useRef, useState } from "react";
import { moves } from "@/features/battle/data/moves";
import { selectMove } from "@/features/battle/engine/battleEngine";
import { decideActionOrder } from "@/features/battle/engine/decideActionOrder";
import type {
  BattleEffectAnimation,
  BattleState,
  MoveId,
  PlayerId,
} from "@/features/battle/types";
import MoveSelector from "./MoveSelector";
import BattleLog from "./BattleLog";
import MonsterStatus from "./MonsterStatus";
import BattleEffects from "./BattleEffects";
import VictoryOverlay from "./VictoryOverlay";

const LOG_INTERVAL_MS = 900;
const HP_REFLECT_DELAY_MS = 450;
const MOTION_CLEAR_MS = 650;

function getNewLogs(before: BattleState, after: BattleState): string[] {
  const addedCount = after.logs.length - before.logs.length;

  if (addedCount <= 0) return [];

  const rawLogs = after.logs
    .slice(0, addedCount)
    .filter((log) => !log.includes("技を選択した！"));

  const winnerLogs = rawLogs.filter((log) => log.includes("の勝ち！"));
  const logsWithoutWinner = rawLogs.filter((log) => !log.includes("の勝ち！"));

  const turnStartIndex = logsWithoutWinner.findIndex((log) =>
    log.startsWith("--- ターン ")
  );

  if (turnStartIndex === -1) {
    return [...logsWithoutWinner, ...winnerLogs];
  }

  const turnEndLogs = logsWithoutWinner.slice(0, turnStartIndex);
  const actionLogs = logsWithoutWinner.slice(turnStartIndex);

  return [...actionLogs, ...turnEndLogs, ...winnerLogs];
}

function getDamageFromLog(
  log: string
): { monsterName: string; damage: number } | null {
  const match = log.match(/^(.+) に (\d+) ダメージ！$/);

  if (!match) return null;

  return {
    monsterName: match[1],
    damage: Number(match[2]),
  };
}

function getActingMonsterName(log: string): string | null {
  const match = log.match(/^(.+) の .+！$/);

  if (!match) return null;
  if (log.includes("ダメージ")) return null;

  return match[1];
}

function getMoveNameFromActionLog(log: string): string | null {
  const match = log.match(/^.+ の (.+)！$/);
  return match?.[1] ?? null;
}

function getAnimationFromLog(log: string): BattleEffectAnimation | null {
  const moveName = getMoveNameFromActionLog(log);

  if (!moveName) return null;

  const move = moves.find((move) => move.name === moveName);

  return move?.animation ?? null;
}

function getPlayerIdByMonsterName(
  state: BattleState,
  monsterName: string | null
): PlayerId | null {
  if (!monsterName) return null;

  if (state.player1.monster.name === monsterName) return "player1";
  if (state.player2.monster.name === monsterName) return "player2";

  return null;
}

function getEffectTargetPlayerId(
  animation: BattleEffectAnimation | null,
  attackerId: PlayerId | null
): PlayerId | null {
  if (!animation || !attackerId) return null;

  if (animation === "buff" || animation === "guard") {
    return attackerId;
  }

  return attackerId === "player1" ? "player2" : "player1";
}

function applyDamageToPlayer(
  state: BattleState,
  playerId: PlayerId,
  damage: number
): BattleState {
  const player = state[playerId];

  return {
    ...state,
    [playerId]: {
      ...player,
      monster: {
        ...player.monster,
        hp: Math.max(0, player.monster.hp - damage),
      },
    },
  };
}

function getRandomAvailableMoveId(
  state: BattleState,
  playerId: PlayerId
): MoveId | null {
  const monsterMoves = state[playerId].monster.moves;
  const movePp = state.movePp[playerId];

  const availableMoves = monsterMoves.filter((moveId) => {
    return (movePp[moveId] ?? 0) > 0;
  });

  if (availableMoves.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableMoves.length);

  return availableMoves[randomIndex];
}

type BattleResult = {
  winner: PlayerId;
};

type BattleScreenProps = {
  mode?: "local" | "story" | "online";
  initialState: BattleState;
  onBattleEnd?: (result: BattleResult) => void;
  // online専用: どちら側が自分か。省略時はplayer1（local/story向けデフォルト）
  localPlayerId?: PlayerId;
  // online専用: サーバーから届いた最新state（selectMoveをローカルで計算するかわりにこれを反映する）
  serverState?: BattleState | null;
  // online専用: 自分の技選択をサーバーへ送る
  onSubmitMove?: (moveId: MoveId) => void;
  // online専用: 選択フェーズの締切（unixミリ秒）。nullなら表示しない
  turnDeadline?: number | null;
};

export default function BattleScreen({
  mode = "local",
  initialState,
  onBattleEnd,
  localPlayerId = "player1",
  serverState = null,
  onSubmitMove,
  turnDeadline = null,
}: BattleScreenProps) {
    const [battleState, setBattleState] = useState(initialState);
    const [visibleBattleState, setVisibleBattleState] = useState(initialState);

    const [currentLog, setCurrentLog] = useState(initialState.logs[0] ?? "");

    useEffect(() => {
        setBattleState(initialState);
        setVisibleBattleState(initialState);
        setCurrentLog(initialState.logs[0] ?? "");

        setIsPlayingLogs(false);
        setActingPlayerId(null);
        setDamagedPlayerId(null);
        setDamageNumberByPlayer({});
        setCurrentEffect(null);
        setEffectTargetPlayerId(null);

        logQueueRef.current = [];
        pendingBattleStateRef.current = null;
        actionOrderQueueRef.current = [];
        currentAttackerIdRef.current = null;
    }, [initialState]);

  const [isPlayingLogs, setIsPlayingLogs] = useState(false);

  const [actingPlayerId, setActingPlayerId] = useState<PlayerId | null>(null);
  const [damagedPlayerId, setDamagedPlayerId] = useState<PlayerId | null>(null);

  const [damageNumberByPlayer, setDamageNumberByPlayer] = useState<
    Partial<Record<PlayerId, number>>
  >({});

  const [currentEffect, setCurrentEffect] =
    useState<BattleEffectAnimation | null>(null);
  const [effectTargetPlayerId, setEffectTargetPlayerId] =
    useState<PlayerId | null>(null);

  const logQueueRef = useRef<string[]>([]);
  const pendingBattleStateRef = useRef<BattleState | null>(null);
  const actionOrderQueueRef = useRef<PlayerId[]>([]);
  const currentAttackerIdRef = useRef<PlayerId | null>(null);

  function clearMotionLater() {
    window.setTimeout(() => {
      setActingPlayerId(null);
      setDamagedPlayerId(null);
      setDamageNumberByPlayer({});
      setCurrentEffect(null);
      setEffectTargetPlayerId(null);
    }, MOTION_CLEAR_MS);
  }

  // ローカルで計算した/サーバーから届いた新しいstateを、ログ再生アニメーションの
  // キューに積む。local/story/onlineの3モードとも最終的にここを通る。
  function enqueueStateTransition(current: BattleState, nextState: BattleState) {
    if (mode === "online") {
      actionOrderQueueRef.current = decideActionOrder(current);
    }

    const newLogs = getNewLogs(current, nextState);

    pendingBattleStateRef.current = nextState;
    logQueueRef.current = newLogs;

    if (newLogs.length > 0) {
      setIsPlayingLogs(true);
    } else {
      setVisibleBattleState(nextState);
    }
  }

const handleSelectMove = (playerId: PlayerId, moveId: MoveId) => {
    if (isPlayingLogs) return;

    if (mode === "story" && playerId === "player2") return;
    if (mode === "online" && playerId !== localPlayerId) return;

    if (mode === "online") {
        // 実際の反映はサーバーから返ってくるstateを待つ。ここでは
        // 「選択済み」の見た目だけ即座に更新しておく（相手にはPPが減った様子は見せない）
        setBattleState((current) => ({
            ...current,
            selectedMoves: {
                ...current.selectedMoves,
                [playerId]: moveId,
            },
        }));

        onSubmitMove?.(moveId);
        return;
    }

    setBattleState((current) => {
        let turnReadyStateForUi: BattleState | null = null;

        if (current.selectedMoves.player1 || current.selectedMoves.player2) {
            turnReadyStateForUi = {
                ...current,
                selectedMoves: {
                    ...current.selectedMoves,
                    [playerId]: moveId,
                },
            };
        }

        let nextState = selectMove(current, playerId, moveId);

        if (
            mode === "story" &&
            playerId === "player1" &&
            nextState.winner === null &&
            nextState.selectedMoves.player1 !== null &&
            nextState.selectedMoves.player2 === null
        ) {
            const cpuMoveId = getRandomAvailableMoveId(nextState, "player2");

            if (cpuMoveId) {
                turnReadyStateForUi = {
                    ...nextState,
                    selectedMoves: {
                        ...nextState.selectedMoves,
                        player2: cpuMoveId,
                    },
                };

                nextState = selectMove(nextState, "player2", cpuMoveId);
            }
        }

        if (turnReadyStateForUi) {
            actionOrderQueueRef.current = decideActionOrder(turnReadyStateForUi);
        }

        enqueueStateTransition(current, nextState);

        return nextState;
    });
  };

  // online専用: サーバーから新しいstateが届いたら、ローカル計算のときと
  // 同じログ再生アニメーションのキューに積む。
  useEffect(() => {
    if (mode !== "online" || !serverState) return;

    setBattleState((current) => {
      enqueueStateTransition(current, serverState);
      return serverState;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverState, mode]);

  useEffect(() => {
    if (!isPlayingLogs) return;

    const timerId = window.setInterval(() => {
      const nextLog = logQueueRef.current.shift();

      setActingPlayerId(null);
      setDamagedPlayerId(null);
      setDamageNumberByPlayer({});
      setCurrentEffect(null);
      setEffectTargetPlayerId(null);

      if (!nextLog) {
        const pendingBattleState = pendingBattleStateRef.current;

        if (pendingBattleState) {
          setVisibleBattleState(pendingBattleState);
        }

        pendingBattleStateRef.current = null;
        setIsPlayingLogs(false);
        window.clearInterval(timerId);
        return;
      }

      setCurrentLog(nextLog);

      const actingName = getActingMonsterName(nextLog);

      if (actingName) {
        const attackerId =
            actionOrderQueueRef.current.shift() ??
            getPlayerIdByMonsterName(visibleBattleState, actingName);

        const animation = getAnimationFromLog(nextLog);

        currentAttackerIdRef.current = attackerId;
        setActingPlayerId(attackerId);
        setCurrentEffect(animation);
        setEffectTargetPlayerId(getEffectTargetPlayerId(animation, attackerId));
        clearMotionLater();
      }

      const damageLog = getDamageFromLog(nextLog);

      if (damageLog) {
        const attackerId = currentAttackerIdRef.current;

        const targetPlayerId =
            attackerId === "player1"
                ? "player2"
                : attackerId === "player2"
                    ? "player1"
                    : getPlayerIdByMonsterName(visibleBattleState, damageLog.monsterName);

        if (!targetPlayerId) return;

        setDamagedPlayerId(targetPlayerId);
        setDamageNumberByPlayer({
            [targetPlayerId]: damageLog.damage,
        });

        clearMotionLater();

        window.setTimeout(() => {
            setVisibleBattleState((current) =>
              applyDamageToPlayer(current, targetPlayerId, damageLog.damage)
            );
        }, HP_REFLECT_DELAY_MS);
      }
    }, LOG_INTERVAL_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isPlayingLogs, visibleBattleState]);

  // online専用: 選択フェーズの残り秒数（1秒ごとに再計算）
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (mode !== "online" || !turnDeadline) {
      setRemainingSeconds(null);
      return;
    }

    const tick = () => {
      const secondsLeft = Math.max(0, Math.ceil((turnDeadline - Date.now()) / 1000));
      setRemainingSeconds(secondsLeft);
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);

    return () => window.clearInterval(intervalId);
  }, [mode, turnDeadline]);

  const opponentPlayerId: PlayerId =
    localPlayerId === "player1" ? "player2" : "player1";

  // onlineは後から部屋に入った側(player2)でも自分が常に左に表示されるようにする。
  // local/storyは元々player1=自分固定なので左のまま。
  const leftPlayerId: PlayerId = mode === "online" ? localPlayerId : "player1";
  const rightPlayerId: PlayerId =
    mode === "online" ? opponentPlayerId : "player2";

  const effectTargetSide: "left" | "right" | null =
    effectTargetPlayerId === null
      ? null
      : effectTargetPlayerId === leftPlayerId
        ? "left"
        : "right";

  const showBothSelectors = mode === "local";
  const showOnlyLocalSelector = mode === "story" || mode === "online";
  const localSelectorPlayerId = mode === "story" ? "player1" : localPlayerId;

  return (
    <main className="h-screen overflow-hidden bg-slate-950 p-3">
      <section
        className="relative h-full overflow-hidden rounded-3xl border-4 border-yellow-300 bg-cover bg-center bg-no-repeat shadow-2xl"
        style={{
          backgroundImage: "url('/battle/background.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

        <BattleEffects animation={currentEffect} targetSide={effectTargetSide} />

        <MonsterStatus
          player={visibleBattleState[leftPlayerId]}
          align="left"
          acting={actingPlayerId === leftPlayerId}
          damaged={damagedPlayerId === leftPlayerId}
          damageNumber={damageNumberByPlayer[leftPlayerId] ?? null}
        />

        <MonsterStatus
          player={visibleBattleState[rightPlayerId]}
          align="right"
          acting={actingPlayerId === rightPlayerId}
          damaged={damagedPlayerId === rightPlayerId}
          damageNumber={damageNumberByPlayer[rightPlayerId] ?? null}
        />

        {showBothSelectors && (
          <div className="absolute left-5 top-[34%] z-30 w-[18rem]">
            <MoveSelector
              playerId="player1"
              title="技を選択してください"
              monster={visibleBattleState.player1.monster}
              selectedMoveId={visibleBattleState.selectedMoves.player1}
              disabled={visibleBattleState.winner !== null || isPlayingLogs}
              movePp={visibleBattleState.movePp.player1}
              onSelectMove={handleSelectMove}
            />
          </div>
        )}

        {showOnlyLocalSelector && (
          <div className="absolute left-5 top-[34%] z-30 w-[18rem]">
            <MoveSelector
              playerId={localSelectorPlayerId}
              title="技を選択してください"
              monster={visibleBattleState[localSelectorPlayerId].monster}
              selectedMoveId={visibleBattleState.selectedMoves[localSelectorPlayerId]}
              disabled={visibleBattleState.winner !== null || isPlayingLogs}
              movePp={visibleBattleState.movePp[localSelectorPlayerId]}
              onSelectMove={handleSelectMove}
            />
          </div>
        )}

        {mode === "local" && (
            <div className="absolute right-5 top-[34%] z-30 w-[18rem]">
                <MoveSelector
                    playerId="player2"
                    title="技を選択してください"
                    monster={visibleBattleState.player2.monster}
                    selectedMoveId={visibleBattleState.selectedMoves.player2}
                    disabled={visibleBattleState.winner !== null || isPlayingLogs}
                    movePp={visibleBattleState.movePp.player2}
                    onSelectMove={handleSelectMove}
                />
            </div>
        )}

        {mode === "online" && (
          <div className="absolute right-5 top-[34%] z-30 w-[18rem] rounded-2xl border-2 border-white/30 bg-black/50 p-4 text-center text-white">
            <p className="text-sm font-bold text-white/80">
              {visibleBattleState.selectedMoves[opponentPlayerId]
                ? "相手は選択済み"
                : "相手が技を選択中..."}
            </p>

            {remainingSeconds !== null &&
              visibleBattleState.winner === null && (
                <p
                  className={`mt-2 text-2xl font-black ${
                    remainingSeconds <= 10 ? "text-red-400" : "text-white"
                  }`}
                >
                  残り {remainingSeconds} 秒
                </p>
              )}
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
            <div className="w-[26rem]">
                <BattleLog log={currentLog} />
            </div>
        </div>

        {!isPlayingLogs && visibleBattleState.winner && (
            <VictoryOverlay
                winnerName={visibleBattleState[visibleBattleState.winner].name}
                actionLabel={
                    mode === "story"
                        ? visibleBattleState.winner === "player1"
                            ? "ストーリーへ戻る"
                            : "リトライ"
                        : mode === "online"
                          ? "ホームへ戻る"
                          : undefined
                }
                onAction={() => {
                    if (!visibleBattleState.winner) return;

                    onBattleEnd?.({
                        winner: visibleBattleState.winner,
                    });
                }}
            />
        )}
      </section>
    </main>
  );
}
