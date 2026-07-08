import type { MonsterId } from "./types";

// バトル側はまだこのキーを読んでいない。
// 選んだ結果を置いておく場所として用意し、バトル側と繋ぐのは別作業とする。
const SELECTED_MONSTER_KEY = "pachimon_selected_monster";

export function saveSelectedMonster(monsterId: MonsterId) {
  localStorage.setItem(SELECTED_MONSTER_KEY, monsterId);
}

export function getSelectedMonster(): MonsterId | null {
  return localStorage.getItem(SELECTED_MONSTER_KEY);
}
