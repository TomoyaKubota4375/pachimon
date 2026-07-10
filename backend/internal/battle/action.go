package battle

import "math/rand"

// ActionResult はcanAct系関数の戻り値（更新後state・行動できるか・ログ）。
type ActionResult struct {
	State  BattleState
	CanAct bool
	Logs   []string
}

func isParalysisFailed() bool {
	return rand.Float64() < 0.25
}

func thawOut() bool {
	return rand.Float64() < 0.2
}

func isConfusionFailed() bool {
	return rand.Float64() < 0.5
}

func processSleep(state BattleState, playerID PlayerID) ActionResult {
	player := state.Get(playerID)
	status := player.Monster.MainStatus

	if status == nil || status.Condition != StatusSleep {
		return ActionResult{State: state, CanAct: true, Logs: []string{}}
	}

	remaining := 0
	if status.RemainingTurns != nil {
		remaining = *status.RemainingTurns
	}

	if remaining <= 0 {
		player.Monster.MainStatus = nil
		state = state.Set(playerID, player)

		return ActionResult{
			State:  state,
			CanAct: true,
			Logs:   []string{player.Monster.Name + " は目を覚ました！"},
		}
	}

	next := remaining - 1
	newStatus := *status
	newStatus.RemainingTurns = &next
	player.Monster.MainStatus = &newStatus
	state = state.Set(playerID, player)

	return ActionResult{
		State:  state,
		CanAct: false,
		Logs:   []string{player.Monster.Name + " は眠っている！"},
	}
}

func processFreeze(state BattleState, playerID PlayerID) ActionResult {
	player := state.Get(playerID)
	status := player.Monster.MainStatus

	if status == nil || status.Condition != StatusFreeze {
		return ActionResult{State: state, CanAct: true, Logs: []string{}}
	}

	if thawOut() {
		player.Monster.MainStatus = nil
		state = state.Set(playerID, player)

		return ActionResult{
			State:  state,
			CanAct: true,
			Logs:   []string{player.Monster.Name + " のこおりがとけた！"},
		}
	}

	return ActionResult{
		State:  state,
		CanAct: false,
		Logs:   []string{player.Monster.Name + " はこおっていて動けない！"},
	}
}

func processConfusion(state BattleState, playerID PlayerID) ActionResult {
	player := state.Get(playerID)
	volatile := player.Monster.VolatileStatus

	if volatile == nil || volatile.Condition != StatusConfusion {
		return ActionResult{State: state, CanAct: true, Logs: []string{}}
	}

	remaining := volatile.RemainingTurns

	if remaining <= 0 {
		player.Monster.VolatileStatus = nil
		state = state.Set(playerID, player)

		return ActionResult{
			State:  state,
			CanAct: true,
			Logs:   []string{player.Monster.Name + " のこんらんがとけた！"},
		}
	}

	newVolatile := *volatile
	newVolatile.RemainingTurns = remaining - 1
	player.Monster.VolatileStatus = &newVolatile
	state = state.Set(playerID, player)

	if isConfusionFailed() {
		return ActionResult{
			State:  state,
			CanAct: false,
			Logs:   []string{player.Monster.Name + " はこんらんして動けない！"},
		}
	}

	return ActionResult{
		State:  state,
		CanAct: true,
		Logs:   []string{player.Monster.Name + " はこんらんしている！"},
	}
}

// CanAct はfeatures/battle/engine/actionEngine.tsのcanActの移植。
// ねむり・こおり・こんらん・まひの順にチェックし、行動できるかどうかを判定する。
func CanAct(state BattleState, playerID PlayerID) ActionResult {
	sleepResult := processSleep(state, playerID)

	if !sleepResult.CanAct || len(sleepResult.Logs) > 0 {
		return sleepResult
	}

	freezeResult := processFreeze(sleepResult.State, playerID)

	if !freezeResult.CanAct || len(freezeResult.Logs) > 0 {
		return freezeResult
	}

	confusionResult := processConfusion(freezeResult.State, playerID)

	if !confusionResult.CanAct {
		return confusionResult
	}

	player := confusionResult.State.Get(playerID)
	status := player.Monster.MainStatus

	if status != nil && status.Condition == StatusParalysis && isParalysisFailed() {
		return ActionResult{
			State:  confusionResult.State,
			CanAct: false,
			Logs:   append(append([]string{}, confusionResult.Logs...), player.Monster.Name+" はまひして動けない！"),
		}
	}

	return ActionResult{
		State:  confusionResult.State,
		CanAct: true,
		Logs:   confusionResult.Logs,
	}
}
