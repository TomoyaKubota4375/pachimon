export const TYPES = {
  BLUE: "blue",
  RED: "red",
  GREEN: "green",
  WHITE: "white",
  BLACK: "black",
} as const;

export type BattleType = (typeof TYPES)[keyof typeof TYPES];