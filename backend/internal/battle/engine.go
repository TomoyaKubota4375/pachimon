package battle

import "strconv"

// SelectMove はfeatures/battle/engine/battleEngine.tsのselectMoveの移植。
// 両陣営が技を選び終えたら自動的にexecuteTurnを呼ぶ。
func SelectMove(state BattleState, playerID PlayerID, moveID MoveID) BattleState {
	if state.Phase == PhaseFinished {
		return state
	}

	if !CanUseMove(state, playerID, moveID) {
		state.Logs = append([]string{state.Get(playerID).Name + " はその技のPPが足りない！"}, state.Logs...)
		return state
	}

	state = ConsumeMovePP(state, playerID, moveID)

	moveIDCopy := moveID
	if playerID == Player1 {
		state.SelectedMoves.Player1 = &moveIDCopy
	} else {
		state.SelectedMoves.Player2 = &moveIDCopy
	}

	state.Logs = append([]string{state.Get(playerID).Name + " が技を選択した！"}, state.Logs...)

	if state.SelectedMoves.Player1 != nil && state.SelectedMoves.Player2 != nil {
		return ExecuteTurn(state)
	}

	return state
}

// ExecuteTurn はfeatures/battle/engine/battleEngine.tsのexecuteTurnの移植。
func ExecuteTurn(state BattleState) BattleState {
	order := DecideActionOrder(state)
	turnLogs := []string{"--- ターン " + strconv.Itoa(state.Turn) + " ---"}

	nextState := state

	for _, attackerID := range order {
		result := ExecuteAttack(nextState, attackerID)
		nextState = result.State
		turnLogs = append(turnLogs, result.Logs...)

		winner := CheckWinner(nextState)

		if winner != nil {
			turnLogs = append(turnLogs, nextState.Get(*winner).Name+" の勝ち！")

			nextState.Phase = PhaseFinished
			nextState.Winner = winner
			nextState.SelectedMoves = SelectedMoves{}
			nextState.Logs = append(turnLogs, nextState.Logs...)

			return nextState
		}
	}

	nextState.Turn++
	nextState.SelectedMoves = SelectedMoves{}
	nextState.Guards = Guards{}
	nextState.Logs = append(turnLogs, nextState.Logs...)

	return ProcessTurnEnd(nextState)
}
