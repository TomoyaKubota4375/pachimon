package battle

func getStatusDamage(maxHP int, condition MainStatusCondition, toxicTurnCount int) int {
	switch condition {
	case StatusBurn:
		return maxInt(1, maxHP/16)
	case StatusPoison:
		return maxInt(1, maxHP/8)
	case StatusBadPoison:
		return maxInt(1, (maxHP*toxicTurnCount)/16)
	}

	return 0
}

func getNextToxicTurnCount(condition MainStatusCondition, toxicTurnCount *int) *int {
	if condition != StatusBadPoison {
		return toxicTurnCount
	}

	current := 1
	if toxicTurnCount != nil {
		current = *toxicTurnCount
	}

	next := current + 1
	return &next
}

func applyEndTurnStatusDamage(state BattleState, playerID PlayerID, logs *[]string) BattleState {
	player := state.Get(playerID)
	status := player.Monster.MainStatus

	if status == nil {
		return state
	}

	toxicCount := 1
	if status.ToxicTurnCount != nil {
		toxicCount = *status.ToxicTurnCount
	}

	damage := getStatusDamage(player.Monster.MaxHP, status.Condition, toxicCount)

	if damage <= 0 {
		return state
	}

	newHP := maxInt(0, player.Monster.HP-damage)

	*logs = append(*logs,
		player.Monster.Name+" は "+getStatusName(string(status.Condition))+" のダメージを受けた！",
		createDamageLog(player.Monster.Name, damage),
	)

	newStatus := *status
	newStatus.ToxicTurnCount = getNextToxicTurnCount(status.Condition, status.ToxicTurnCount)

	player.Monster.HP = newHP
	player.Monster.MainStatus = &newStatus

	return state.Set(playerID, player)
}

// ProcessTurnEnd はfeatures/battle/engine/turnEndEngine.tsの移植。
// やけど・どく・もうどくのターン終了時ダメージを処理し、決着していればphaseをfinishedにする。
func ProcessTurnEnd(state BattleState) BattleState {
	logs := []string{"--- ターン終了 ---"}

	nextState := applyEndTurnStatusDamage(state, Player1, &logs)
	nextState = applyEndTurnStatusDamage(nextState, Player2, &logs)

	winner := CheckWinner(nextState)

	if winner != nil {
		logs = append(logs, nextState.Get(*winner).Name+" の勝ち！")

		nextState.Phase = PhaseFinished
		nextState.Winner = winner
		nextState.Logs = append(logs, nextState.Logs...)

		return nextState
	}

	nextState.Logs = append(logs, nextState.Logs...)

	return nextState
}
