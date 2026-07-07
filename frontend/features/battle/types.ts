export type PlayerId = "player1" | "player2";

import type { BattleType } from "./data/types";

export type MoveId =
  | "tackle"
  | "fire-ball"
  | "attack-up"
  | "speed-down"
  | "poison-gas"
  | "guard";

export type MainStatusCondition =
  | "burn"
  | "paralysis"
  | "poison"
  | "bad-poison"
  | "freeze"
  | "sleep";

export type VolatileStatusCondition =
  | "confusion";

export type StatName =
  | "attack"
  | "defense"
  | "speed";

export type StatStages = {
  attack: number;
  defense: number;
  speed: number;
};

export type MainStatusState = {
  condition: MainStatusCondition;
  remainingTurns?: number;

  // もうどく用
  toxicTurnCount?: number;

  // こおり用
  freezeTurnCount?: number;
};

export type VolatileStatusState = {
  condition: VolatileStatusCondition;
  remainingTurns: number;
};

export type BattleMonster = {
  id: string;

  name: string;

  type: BattleType;

  hp: number;
  maxHp: number;

  attack: number;
  defense: number;
  speed: number;

  statStages: StatStages;

  mainStatus: MainStatusState | null;

  volatileStatus: VolatileStatusState | null;

  moves: MoveId[];
};

export type BattlePlayer = {
  id: PlayerId;
  name: string;
  monster: BattleMonster;
};

export type MoveCategory =
  | "attack"
  | "buff"
  | "debuff"
  | "status"
  | "guard";

export type MoveStatChange = {
  target: "self" | "opponent";

  stat: StatName;

  stages: number;

  chance: number;
};

export type MoveStatusEffect = {
  target: "self" | "opponent";

  condition:
    | MainStatusCondition
    | VolatileStatusCondition;

  chance: number;
};

export type BattleMove = {
  id: MoveId;

  name: string;

  type: BattleType;

  category: MoveCategory;

  maxPp: number;

  accuracy: number;

  priority: number;

  power?: number;

  statChanges?: MoveStatChange[];

  statusEffects?: MoveStatusEffect[];
};

export type BattleState = {
  turn: number;

  phase: "selecting" | "finished";

  player1: BattlePlayer;

  player2: BattlePlayer;

  selectedMoves: {
    player1: MoveId | null;
    player2: MoveId | null;
  };

  // ★各モンスターが持っている技だけ保持
  movePp: {
    player1: Partial<Record<MoveId, number>>;
    player2: Partial<Record<MoveId, number>>;
  };

  logs: string[];

  winner: PlayerId | null;
};