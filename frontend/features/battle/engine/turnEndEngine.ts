import type {
  BattleState,
  MainStatusCondition,
  PlayerId,
} from "../types";
import { checkWinner } from "./checkWinner";

function getStatusName(condition: MainStatusCondition): string {
  switch (condition) {
    case "burn":
      return "やけど";
    case "poison":
      return "どく";
    case "bad-poison":
      return "もうどく";
    case "paralysis":
      return "まひ";
    case "sleep":
      return "ねむり";
    case "freeze":
      return "こおり";
    default:
      return condition;
  }
}

function getStatusDamage(
  maxHp: number,
  condition: MainStatusCondition,
  toxicTurnCount = 1
): number {
  if (condition === "burn") {
    return Math.max(1, Math.floor(maxHp / 16));
  }

  if (condition === "poison") {
    return Math.max(1, Math.floor(maxHp / 8));
  }

  if (condition === "bad-poison") {
    return Math.max(1, Math.floor((maxHp * toxicTurnCount) / 16));
  }

  return 0;
}

function getNextToxicTurnCount(
  condition: MainStatusCondition,
  toxicTurnCount: number | undefined
): number | undefined {
  if (condition !== "bad-poison") {
    return toxicTurnCount;
  }

  return (toxicTurnCount ?? 1) + 1;
}

function applyEndTurnStatusDamage(
  state: BattleState,
  playerId: PlayerId,
  logs: string[]
): BattleState {
  const player = state[playerId];
  const status = player.monster.mainStatus;

  if (!status) return state;

  const damage = getStatusDamage(
    player.monster.maxHp,
    status.condition,
    status.toxicTurnCount ?? 1
  );

  if (damage <= 0) return state;

  const newHp = Math.max(0, player.monster.hp - damage);

  logs.push(
    `${player.monster.name} は ${getStatusName(
      status.condition
    )} のダメージを受けた！`
  );
  logs.push(`${player.monster.name} に ${damage} ダメージ！`);

  return {
    ...state,
    [playerId]: {
      ...player,
      monster: {
        ...player.monster,
        hp: newHp,
        mainStatus: {
          ...status,
          toxicTurnCount: getNextToxicTurnCount(
            status.condition,
            status.toxicTurnCount
          ),
        },
      },
    },
  };
}

export function processTurnEnd(state: BattleState): BattleState {
  const logs: string[] = ["--- ターン終了 ---"];

  let nextState = state;

  nextState = applyEndTurnStatusDamage(nextState, "player1", logs);
  nextState = applyEndTurnStatusDamage(nextState, "player2", logs);

  const winner = checkWinner(nextState);

  if (winner) {
    logs.push(`${nextState[winner].name} の勝ち！`);

    return {
      ...nextState,
      phase: "finished",
      winner,
      logs: [...logs, ...nextState.logs],
    };
  }

  return {
    ...nextState,
    logs: [...logs, ...nextState.logs],
  };
}