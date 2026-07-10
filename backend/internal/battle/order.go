package battle

import "math/rand"

func getMovePriority(moveID *MoveID) int {
	if moveID == nil {
		return 0
	}

	move, ok := FindMove(*moveID)
	if !ok {
		return 0
	}

	return move.Priority
}

func getBattleSpeed(state BattleState, playerID PlayerID) int {
	monster := state.Get(playerID).Monster

	modified := GetModifiedStat(monster.Speed, monster.StatStages.Speed)

	if monster.MainStatus != nil && monster.MainStatus.Condition == StatusParalysis {
		return maxInt(1, modified/2)
	}

	return modified
}

// DecideActionOrder はfeatures/battle/engine/decideActionOrder.tsの移植。
// 優先度が高い方が先攻。同じなら素早さ、それも同じならランダム。
func DecideActionOrder(state BattleState) []PlayerID {
	p1Priority := getMovePriority(state.SelectedMoves.Player1)
	p2Priority := getMovePriority(state.SelectedMoves.Player2)

	if p1Priority > p2Priority {
		return []PlayerID{Player1, Player2}
	}

	if p2Priority > p1Priority {
		return []PlayerID{Player2, Player1}
	}

	p1Speed := getBattleSpeed(state, Player1)
	p2Speed := getBattleSpeed(state, Player2)

	if p1Speed > p2Speed {
		return []PlayerID{Player1, Player2}
	}

	if p2Speed > p1Speed {
		return []PlayerID{Player2, Player1}
	}

	if rand.Float64() < 0.5 {
		return []PlayerID{Player1, Player2}
	}

	return []PlayerID{Player2, Player1}
}
