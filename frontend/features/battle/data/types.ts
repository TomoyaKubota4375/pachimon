export const TYPES = {
  BLUE: "blue",
  RED: "red",
  GREEN: "green",
  YELLOW: "yellow",
  WHITE: "white",
  BLACK: "black",
} as const;

export type BattleType = (typeof TYPES)[keyof typeof TYPES];