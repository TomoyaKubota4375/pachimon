import type { BattleState, PlayerId } from "../types";

export type ActionResult = {
  state: BattleState;
  canAct: boolean;
  logs: string[];
};

function isParalysisFailed(): boolean {
  return Math.random() < 0.25;
}

function thawOut(): boolean {
  return Math.random() < 0.2;
}

function isConfusionFailed(): boolean {
  return Math.random() < 0.5;
}

function processSleep(
  state: BattleState,
  playerId: PlayerId
): ActionResult {
  const player = state[playerId];
  const status = player.monster.mainStatus;

  if (status?.condition !== "sleep") {
    return { state, canAct: true, logs: [] };
  }

  const remainingTurns = status.remainingTurns ?? 0;

  if (remainingTurns <= 0) {
    return {
      state: {
        ...state,
        [playerId]: {
          ...player,
          monster: {
            ...player.monster,
            mainStatus: null,
          },
        },
      },
      canAct: true,
      logs: [`${player.monster.name} は目を覚ました！`],
    };
  }

  return {
    state: {
      ...state,
      [playerId]: {
        ...player,
        monster: {
          ...player.monster,
          mainStatus: {
            ...status,
            remainingTurns: remainingTurns - 1,
          },
        },
      },
    },
    canAct: false,
    logs: [`${player.monster.name} は眠っている！`],
  };
}

function processFreeze(
  state: BattleState,
  playerId: PlayerId
): ActionResult {
  const player = state[playerId];
  const status = player.monster.mainStatus;

  if (status?.condition !== "freeze") {
    return { state, canAct: true, logs: [] };
  }

  if (thawOut()) {
    return {
      state: {
        ...state,
        [playerId]: {
          ...player,
          monster: {
            ...player.monster,
            mainStatus: null,
          },
        },
      },
      canAct: true,
      logs: [`${player.monster.name} のこおりがとけた！`],
    };
  }

  return {
    state,
    canAct: false,
    logs: [`${player.monster.name} はこおっていて動けない！`],
  };
}

function processConfusion(
  state: BattleState,
  playerId: PlayerId
): ActionResult {
  const player = state[playerId];
  const volatileStatus = player.monster.volatileStatus;

  if (volatileStatus?.condition !== "confusion") {
    return { state, canAct: true, logs: [] };
  }

  const remainingTurns = volatileStatus.remainingTurns;

  if (remainingTurns <= 0) {
    return {
      state: {
        ...state,
        [playerId]: {
          ...player,
          monster: {
            ...player.monster,
            volatileStatus: null,
          },
        },
      },
      canAct: true,
      logs: [`${player.monster.name} のこんらんがとけた！`],
    };
  }

  const nextState: BattleState = {
    ...state,
    [playerId]: {
      ...player,
      monster: {
        ...player.monster,
        volatileStatus: {
          ...volatileStatus,
          remainingTurns: remainingTurns - 1,
        },
      },
    },
  };

  if (isConfusionFailed()) {
    return {
      state: nextState,
      canAct: false,
      logs: [`${player.monster.name} はこんらんして動けない！`],
    };
  }

  return {
    state: nextState,
    canAct: true,
    logs: [`${player.monster.name} はこんらんしている！`],
  };
}

export function canAct(
  state: BattleState,
  playerId: PlayerId
): ActionResult {
  const sleepResult = processSleep(state, playerId);

  if (!sleepResult.canAct || sleepResult.logs.length > 0) {
    return sleepResult;
  }

  const freezeResult = processFreeze(sleepResult.state, playerId);

  if (!freezeResult.canAct || freezeResult.logs.length > 0) {
    return freezeResult;
  }

  const confusionResult = processConfusion(
    freezeResult.state,
    playerId
  );

  if (!confusionResult.canAct) {
    return confusionResult;
  }

  const player = confusionResult.state[playerId];
  const status = player.monster.mainStatus;

  if (status?.condition === "paralysis") {
    if (isParalysisFailed()) {
      return {
        state: confusionResult.state,
        canAct: false,
        logs: [
          ...confusionResult.logs,
          `${player.monster.name} はまひして動けない！`,
        ],
      };
    }
  }

  return {
    state: confusionResult.state,
    canAct: true,
    logs: confusionResult.logs,
  };
}