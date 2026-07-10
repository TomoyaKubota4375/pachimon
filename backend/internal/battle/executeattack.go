package battle

import "math/rand"

func isMoveHit(accuracy float64) bool {
	return rand.Float64()*100 < accuracy
}

// ExecuteAttackResult はExecuteAttackの戻り値。
type ExecuteAttackResult struct {
	State BattleState
	Logs  []string
}

// ExecuteAttack はfeatures/battle/engine/executeAttack.tsの移植。
// 状態異常による行動不能判定 → 命中判定 → 効果適用、の順で1体ぶんの行動を処理する。
func ExecuteAttack(state BattleState, attackerID PlayerID) ExecuteAttackResult {
	moveIDPtr := state.SelectedMoves.Player2
	if attackerID == Player1 {
		moveIDPtr = state.SelectedMoves.Player1
	}

	if moveIDPtr == nil {
		return ExecuteAttackResult{State: state, Logs: []string{}}
	}

	attacker := state.Get(attackerID)
	defenderID := GetOpponentID(attackerID)
	defender := state.Get(defenderID)

	move, ok := FindMove(*moveIDPtr)
	if !ok {
		return ExecuteAttackResult{State: state, Logs: []string{"技が見つかりません！"}}
	}

	if attacker.Monster.HP <= 0 {
		return ExecuteAttackResult{
			State: state,
			Logs:  []string{attacker.Monster.Name + " は倒れていて動けない！"},
		}
	}

	actionResult := CanAct(state, attackerID)

	if !actionResult.CanAct {
		return ExecuteAttackResult{State: actionResult.State, Logs: actionResult.Logs}
	}

	state = actionResult.State
	logs := []string{attacker.Monster.Name + " の " + move.Name + "！"}

	accuracyMultiplier := GetAccuracyMultiplier(attacker.Monster.StatStages.Accuracy)
	evasionMultiplier := GetAccuracyMultiplier(defender.Monster.StatStages.Evasion)

	finalAccuracy := float64(move.Accuracy) * (accuracyMultiplier / evasionMultiplier)

	if !isMoveHit(finalAccuracy) {
		logs = append(logs, attacker.Monster.Name+" の攻撃は外れた！")
		return ExecuteAttackResult{State: state, Logs: logs}
	}

	result := ApplyMoveEffects(state, attackerID, move)

	return ExecuteAttackResult{
		State: result.State,
		Logs:  append(logs, result.Logs...),
	}
}
