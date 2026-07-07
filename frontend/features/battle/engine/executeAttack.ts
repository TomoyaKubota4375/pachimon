import type { BattleState, PlayerId, MoveId } from "../types";
import { calculateDamage } from "../mechanics/damage";
import { moves } from "../data/moves";
import { getOpponentId } from "./getOpponentId";

function getMove(moveId: MoveId) {
  return moves.find((move) => move.id === moveId);
}

function isMoveHit(accuracy: number): boolean {
  return Math.random() * 100 < accuracy;
}

type ExecuteAttackResult = {
  state: BattleState;
  logs: string[];
};

export function executeAttack(
  state: BattleState,
  attackerId: PlayerId
): ExecuteAttackResult {
  const moveId = state.selectedMoves[attackerId];
  const logs: string[] = [];

  if (!moveId) return { state, logs };

  const attacker = state[attackerId];
  const defenderId = getOpponentId(attackerId);
  const defender = state[defenderId];
  const move = getMove(moveId);

  if (!move) {
    logs.push("技が見つかりません！");
    return { state, logs };
  }

  if (attacker.monster.hp <= 0) {
    logs.push(`${attacker.monster.name} は倒れていて動けない！`);
    return { state, logs };
  }

  if (move.category === "guard") {
    logs.push(`${attacker.monster.name} は身を守っている！`);
    return { state, logs };
  }

  if (defender.monster.hp <= 0) return { state, logs };

  logs.push(`${attacker.monster.name} の ${move.name}！`);

  if (!isMoveHit(move.accuracy)) {
    logs.push(`${attacker.monster.name} の攻撃は外れた！`);
    return { state, logs };
  }

  const defenderMoveId = state.selectedMoves[defenderId];
  const defenderMove = defenderMoveId ? getMove(defenderMoveId) : null;

  if (defenderMove?.category === "guard") {
    logs.push(`${defender.monster.name} は攻撃を防いだ！`);
    return { state, logs };
  }

  if (move.category !== "attack") {
    return { state, logs };
  }

  const damage = calculateDamage({
    attacker: attacker.monster,
    defender: defender.monster,
    power: move.power ?? 0,
    moveType: move.type,
  });

  const newHp = Math.max(0, defender.monster.hp - damage);

  logs.push(`${defender.monster.name} に ${damage} ダメージ！`);

  return {
    state: {
      ...state,
      [defenderId]: {
        ...defender,
        monster: {
          ...defender.monster,
          hp: newHp,
        },
      },
    },
    logs,
  };
}