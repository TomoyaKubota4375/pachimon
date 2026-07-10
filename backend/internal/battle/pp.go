package battle

// GetMovePP は残りPPを返す（未設定なら0）。
func GetMovePP(state BattleState, playerID PlayerID, moveID MoveID) int {
	pp := getPlayerMovePP(state, playerID)
	return pp[moveID]
}

// CanUseMove はPPが1以上残っているか。
func CanUseMove(state BattleState, playerID PlayerID, moveID MoveID) bool {
	return GetMovePP(state, playerID, moveID) > 0
}

// ConsumeMovePP は指定した技のPPを1減らした新しいBattleStateを返す。
func ConsumeMovePP(state BattleState, playerID PlayerID, moveID MoveID) BattleState {
	current := GetMovePP(state, playerID, moveID)

	next := copyMovePP(getPlayerMovePP(state, playerID))
	next[moveID] = maxInt(0, current-1)

	if playerID == Player1 {
		state.MovePP.Player1 = next
	} else {
		state.MovePP.Player2 = next
	}

	return state
}

func getPlayerMovePP(state BattleState, playerID PlayerID) MovePP {
	if playerID == Player1 {
		return state.MovePP.Player1
	}
	return state.MovePP.Player2
}

func copyMovePP(pp MovePP) MovePP {
	next := make(MovePP, len(pp))
	for k, v := range pp {
		next[k] = v
	}
	return next
}
