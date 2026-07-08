import type { BattleType } from "./data/types";
import type { MoveId } from "./data/moves";

export type { MoveId };

export type PlayerId = "player1" | "player2";

export type BattleEffectAnimation =
  | "red-attack"
  | "blue-attack"
  | "yellow-attack"
  | "white-attack"
  | "black-attack"
  | "normal-attack"
  | "buff"
  | "debuff"
  | "status"
  | "guard";

export type MainStatusCondition =
  | "burn"
  | "paralysis"
  | "poison"
  | "bad-poison"
  | "freeze"
  | "sleep";

export type VolatileStatusCondition = "confusion";

export type StatName =
  | "attack"
  | "defense"
  | "speed"
  | "accuracy"
  | "evasion";

export type StatStages = {
  attack: number;
  defense: number;
  speed: number;
  accuracy: number;
  evasion: number;
};

export type MonsterData = {
  id: string;
  name: string;
  type: BattleType;
  imagePath: string;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: MoveId[];
};

export type MainStatusState = {
  condition: MainStatusCondition;
  remainingTurns?: number;
  toxicTurnCount?: number;
  freezeTurnCount?: number;
};

export type VolatileStatusState = {
  condition: VolatileStatusCondition;
  remainingTurns: number;
};

export type BattleMonster = MonsterData & {
  hp: number;
  statStages: StatStages;
  mainStatus: MainStatusState | null;
  volatileStatus: VolatileStatusState | null;
};

export type BattlePlayer = {
  id: PlayerId;
  name: string;
  monster: BattleMonster;
};

export type DamageEffect = {
  type: "damage";
  power: number;
};

export type StatEffect = {
  type: "stat";
  target: "self" | "opponent";
  stat: StatName;
  stages: number;
  chance: number;
};

export type StatusEffect = {
  type: "status";
  target: "self" | "opponent";
  condition: MainStatusCondition | VolatileStatusCondition;
  chance: number;
};

export type GuardEffect = {
  type: "guard";
};

export type MoveEffect =
  | DamageEffect
  | StatEffect
  | StatusEffect
  | GuardEffect;

export type BattleMove = {
  id: string;
  name: string;
  type: BattleType;
  maxPp: number;
  accuracy: number;
  priority: number;
  animation: BattleEffectAnimation;
  effects: MoveEffect[];
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

  guards: {
    player1: boolean;
    player2: boolean;
  };

  movePp: {
    player1: Partial<Record<MoveId, number>>;
    player2: Partial<Record<MoveId, number>>;
  };

  logs: string[];
  winner: PlayerId | null;
};