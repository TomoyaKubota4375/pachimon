package battle

// CheckWinner はHPが尽きた陣営がいれば相手側のPlayerIDを返す。両者健在ならnil。
func CheckWinner(state BattleState) *PlayerID {
	if state.Player1.Monster.HP <= 0 {
		winner := Player2
		return &winner
	}

	if state.Player2.Monster.HP <= 0 {
		winner := Player1
		return &winner
	}

	return nil
}
