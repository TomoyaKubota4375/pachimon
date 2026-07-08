"use client";

import { useEffect, useRef, useState } from "react";
import { moves } from "@/features/battle/data/moves";
import { initialBattleState } from "@/features/battle/data/initialBattleState";
import { selectMove } from "@/features/battle/engine/battleEngine";
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

function applyDamageLog(state: BattleState, log: string): BattleState {
  const damageLog = getDamageFromLog(log);

  if (!damageLog) return state;

  const updatePlayerHp = (playerId: PlayerId) => {
    const player = state[playerId];

    if (player.monster.name !== damageLog.monsterName) {
      return player;
    }

    return {
      ...player,
      monster: {
        ...player.monster,
        hp: Math.max(0, player.monster.hp - damageLog.damage),
      },
    };
  };

  return {
    ...state,
    player1: updatePlayerHp("player1"),
    player2: updatePlayerHp("player2"),
  };
}

export default function BattleScreen() {
  const [battleState, setBattleState] = useState(initialBattleState);
  const [visibleBattleState, setVisibleBattleState] =
    useState(initialBattleState);

  const [currentLog, setCurrentLog] = useState(initialBattleState.logs[0] ?? "");
  const [isPlayingLogs, setIsPlayingLogs] = useState(false);

  const [actingMonsterName, setActingMonsterName] = useState<string | null>(
    null
  );
  const [damagedMonsterName, setDamagedMonsterName] = useState<string | null>(
    null
  );
  const [damageNumberByPlayer, setDamageNumberByPlayer] = useState<
    Partial<Record<PlayerId, number>>
  >({});

  const [currentEffect, setCurrentEffect] =
    useState<BattleEffectAnimation | null>(null);
  const [effectTargetPlayerId, setEffectTargetPlayerId] =
    useState<PlayerId | null>(null);

  const logQueueRef = useRef<string[]>([]);
  const pendingBattleStateRef = useRef<BattleState | null>(null);

  function clearMotionLater() {
    window.setTimeout(() => {
      setActingMonsterName(null);
      setDamagedMonsterName(null);
      setDamageNumberByPlayer({});
      setCurrentEffect(null);
      setEffectTargetPlayerId(null);
    }, MOTION_CLEAR_MS);
  }

  const handleSelectMove = (playerId: PlayerId, moveId: MoveId) => {
    if (isPlayingLogs) return;

    setBattleState((current) => {
      const nextState = selectMove(current, playerId, moveId);
      const newLogs = getNewLogs(current, nextState);

      pendingBattleStateRef.current = nextState;
      logQueueRef.current = newLogs;

      if (newLogs.length > 0) {
        setIsPlayingLogs(true);
      } else {
        setVisibleBattleState(nextState);
      }

      return nextState;
    });
  };

  useEffect(() => {
    if (!isPlayingLogs) return;

    const timerId = window.setInterval(() => {
      const nextLog = logQueueRef.current.shift();

      setActingMonsterName(null);
      setDamagedMonsterName(null);
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
        const attackerId = getPlayerIdByMonsterName(
          visibleBattleState,
          actingName
        );
        const animation = getAnimationFromLog(nextLog);

        setActingMonsterName(actingName);
        setCurrentEffect(animation);
        setEffectTargetPlayerId(getEffectTargetPlayerId(animation, attackerId));
        clearMotionLater();
      }

      const damageLog = getDamageFromLog(nextLog);

      if (damageLog) {
        const damagedPlayerId = getPlayerIdByMonsterName(
          visibleBattleState,
          damageLog.monsterName
        );

        setDamagedMonsterName(damageLog.monsterName);

        if (damagedPlayerId) {
          setDamageNumberByPlayer({
            [damagedPlayerId]: damageLog.damage,
          });
        }

        clearMotionLater();

        window.setTimeout(() => {
          setVisibleBattleState((current) => applyDamageLog(current, nextLog));
        }, HP_REFLECT_DELAY_MS);
      }
    }, LOG_INTERVAL_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isPlayingLogs, visibleBattleState]);

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

        <BattleEffects
          animation={currentEffect}
          targetPlayerId={effectTargetPlayerId}
        />

        <MonsterStatus
          player={visibleBattleState.player1}
          align="left"
          acting={actingMonsterName === visibleBattleState.player1.monster.name}
          damaged={
            damagedMonsterName === visibleBattleState.player1.monster.name
          }
          damageNumber={damageNumberByPlayer.player1 ?? null}
        />

        <MonsterStatus
          player={visibleBattleState.player2}
          align="right"
          acting={actingMonsterName === visibleBattleState.player2.monster.name}
          damaged={
            damagedMonsterName === visibleBattleState.player2.monster.name
          }
          damageNumber={damageNumberByPlayer.player2 ?? null}
        />

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

        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
            <div className="w-[26rem]">
                <BattleLog log={currentLog} />
            </div>
        </div>

        {!isPlayingLogs && visibleBattleState.winner && (
          <VictoryOverlay
            winnerName={visibleBattleState[visibleBattleState.winner].name}
          />
        )}
      </section>
    </main>
  );
}