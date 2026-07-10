package battle

import "math/rand"

// EffectResult は効果適用の結果（更新後のstate＋ログ）。
type EffectResult struct {
	State BattleState
	Logs  []string
}

func isSuccess(chance int) bool {
	return rand.Float64()*100 < float64(chance)
}

func getTargetPlayerID(attackerID PlayerID, target EffectTarget) PlayerID {
	if target == TargetSelf {
		return attackerID
	}
	return GetOpponentID(attackerID)
}

// applyDamageEffect はfeatures/battle/engine/effects/damageEffect.tsの移植。
func applyDamageEffect(state BattleState, attackerID PlayerID, move BattleMove, effect MoveEffect) EffectResult {
	defenderID := GetOpponentID(attackerID)

	attacker := state.Get(attackerID)
	defender := state.Get(defenderID)

	guarded := state.Guards.Player2
	if defenderID == Player1 {
		guarded = state.Guards.Player1
	}

	if guarded {
		return EffectResult{
			State: state,
			Logs:  []string{createGuardSuccessLog(defender.Monster.Name)},
		}
	}

	result := CalculateDamage(CalculateDamageParams{
		Attacker: attacker.Monster,
		Defender: defender.Monster,
		Power:    effect.Power,
		MoveType: move.Type,
	})

	logs := []string{}

	if result.Critical {
		logs = append(logs, createCriticalLog())
	}

	logs = append(logs, createDamageLog(defender.Monster.Name, result.Damage))

	defender.Monster.HP = maxInt(0, defender.Monster.HP-result.Damage)
	state = state.Set(defenderID, defender)

	return EffectResult{State: state, Logs: logs}
}

// applyStatEffect はfeatures/battle/engine/effects/statEffect.tsの移植。
func applyStatEffect(state BattleState, attackerID PlayerID, effect MoveEffect) EffectResult {
	if !isSuccess(effect.Chance) {
		return EffectResult{State: state, Logs: []string{}}
	}

	targetID := getTargetPlayerID(attackerID, effect.Target)
	target := state.Get(targetID)

	target.Monster.StatStages = ApplyStageChange(target.Monster.StatStages, effect.Stat, effect.Stages)
	state = state.Set(targetID, target)

	return EffectResult{
		State: state,
		Logs:  []string{createStatChangeLog(target.Monster.Name, effect.Stat, effect.Stages)},
	}
}

func isMainStatusCondition(condition string) bool {
	return condition != string(StatusConfusion)
}

func getSleepTurns() int {
	return 3
}

// applyStatusEffect はfeatures/battle/engine/effects/statusEffect.tsの移植。
func applyStatusEffect(state BattleState, attackerID PlayerID, effect MoveEffect) EffectResult {
	if !isSuccess(effect.Chance) {
		return EffectResult{State: state, Logs: []string{}}
	}

	targetID := getTargetPlayerID(attackerID, effect.Target)
	target := state.Get(targetID)
	monster := target.Monster

	if !isMainStatusCondition(effect.Condition) {
		if monster.VolatileStatus != nil {
			return EffectResult{
				State: state,
				Logs:  []string{createAlreadyVolatileStatusLog(monster.Name)},
			}
		}

		monster.VolatileStatus = &VolatileStatusState{
			Condition:      VolatileStatusCondition(effect.Condition),
			RemainingTurns: 3,
		}
		target.Monster = monster
		state = state.Set(targetID, target)

		return EffectResult{
			State: state,
			Logs:  []string{createVolatileStatusLog(monster.Name, VolatileStatusCondition(effect.Condition))},
		}
	}

	if monster.MainStatus != nil {
		return EffectResult{
			State: state,
			Logs:  []string{createAlreadyMainStatusLog(monster.Name)},
		}
	}

	condition := MainStatusCondition(effect.Condition)

	newStatus := &MainStatusState{Condition: condition}

	if condition == StatusSleep {
		turns := getSleepTurns()
		newStatus.RemainingTurns = &turns
	}

	if condition == StatusBadPoison {
		one := 1
		newStatus.ToxicTurnCount = &one
	}

	monster.MainStatus = newStatus
	target.Monster = monster
	state = state.Set(targetID, target)

	return EffectResult{
		State: state,
		Logs:  []string{createMainStatusLog(monster.Name, condition)},
	}
}

// applyGuardEffect はfeatures/battle/engine/effects/guardEffect.tsの移植。
func applyGuardEffect(state BattleState, attackerID PlayerID) EffectResult {
	attacker := state.Get(attackerID)

	if attackerID == Player1 {
		state.Guards.Player1 = true
	} else {
		state.Guards.Player2 = true
	}

	return EffectResult{
		State: state,
		Logs:  []string{createGuardLog(attacker.Monster.Name)},
	}
}

func applyEffect(state BattleState, attackerID PlayerID, move BattleMove, effect MoveEffect) EffectResult {
	switch effect.Type {
	case EffectDamage:
		return applyDamageEffect(state, attackerID, move, effect)
	case EffectStat:
		return applyStatEffect(state, attackerID, effect)
	case EffectStatus:
		return applyStatusEffect(state, attackerID, effect)
	case EffectGuard:
		return applyGuardEffect(state, attackerID)
	}

	return EffectResult{State: state, Logs: []string{}}
}

// ApplyMoveEffects はfeatures/battle/engine/effects/effectEngine.tsの移植。
// 技が持つ効果を順番に適用していく。
func ApplyMoveEffects(state BattleState, attackerID PlayerID, move BattleMove) EffectResult {
	nextState := state
	logs := []string{}

	for _, effect := range move.Effects {
		result := applyEffect(nextState, attackerID, move, effect)
		nextState = result.State
		logs = append(logs, result.Logs...)
	}

	return EffectResult{State: nextState, Logs: logs}
}
