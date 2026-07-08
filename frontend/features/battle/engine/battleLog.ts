import type {
  MainStatusCondition,
  StatName,
  VolatileStatusCondition,
} from "../types";

function getStatName(stat: StatName): string {
  switch (stat) {
    case "attack":
      return "こうげき";
    case "defense":
      return "ぼうぎょ";
    case "speed":
      return "すばやさ";
    case "accuracy":
      return "命中";
    case "evasion":
      return "回避";
  }
}

function getStatusName(
  condition: MainStatusCondition | VolatileStatusCondition
): string {
  switch (condition) {
    case "poison":
      return "どく";
    case "bad-poison":
      return "もうどく";
    case "burn":
      return "やけど";
    case "paralysis":
      return "まひ";
    case "sleep":
      return "ねむり";
    case "freeze":
      return "こおり";
    case "confusion":
      return "こんらん";
  }
}

export function createDamageLog(
  monsterName: string,
  damage: number
): string {
  return `${monsterName} に ${damage} ダメージ！`;
}

export function createCriticalLog(): string {
  return "急所に当たった！";
}

export function createGuardLog(monsterName: string): string {
  return `${monsterName} は身を守っている！`;
}

export function createGuardSuccessLog(monsterName: string): string {
  return `${monsterName} は攻撃を防いだ！`;
}

export function createStatChangeLog(
  monsterName: string,
  stat: StatName,
  stages: number
): string {
  const direction = stages > 0 ? "上がった" : "下がった";

  return `${monsterName} の${getStatName(stat)}が${direction}！`;
}

export function createAlreadyMainStatusLog(
  monsterName: string
): string {
  return `${monsterName} はすでに状態異常になっている！`;
}

export function createAlreadyVolatileStatusLog(
  monsterName: string
): string {
  return `${monsterName} はすでに状態変化している！`;
}

export function createMainStatusLog(
  monsterName: string,
  condition: MainStatusCondition
): string {
  return `${monsterName} は${getStatusName(condition)}状態になった！`;
}

export function createVolatileStatusLog(
  monsterName: string,
  condition: VolatileStatusCondition
): string {
  return `${monsterName} は${getStatusName(condition)}した！`;
}