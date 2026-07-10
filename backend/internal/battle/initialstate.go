package battle

func createMovePP(moveIDs []MoveID) MovePP {
	pp := make(MovePP, len(moveIDs))

	for _, moveID := range moveIDs {
		if move, ok := FindMove(moveID); ok {
			pp[moveID] = move.MaxPP
		}
	}

	return pp
}

// NewMonster はfeatures/battle/data/monsters.tsのcreateMonsterの移植。
// 種族データ(MonsterData)から、バトル用の初期状態(BattleMonster)を作る。
func NewMonster(id string) (BattleMonster, bool) {
	data, ok := FindMonster(id)
	if !ok {
		return BattleMonster{}, false
	}

	movesCopy := make([]MoveID, len(data.Moves))
	copy(movesCopy, data.Moves)
	data.Moves = movesCopy

	return BattleMonster{
		MonsterData: data,
		HP:          data.MaxHP,
		StatStages:  newStatStages(),
	}, true
}

// NewBattleState はfeatures/battle/data/createInitialBattleState.tsの移植。
func NewBattleState(player1MonsterID, player2MonsterID string) (BattleState, bool) {
	player1Monster, ok := NewMonster(player1MonsterID)
	if !ok {
		return BattleState{}, false
	}

	player2Monster, ok := NewMonster(player2MonsterID)
	if !ok {
		return BattleState{}, false
	}

	return BattleState{
		Turn:  1,
		Phase: PhaseSelecting,

		Player1: BattlePlayer{ID: Player1, Name: "プレイヤー1", Monster: player1Monster},
		Player2: BattlePlayer{ID: Player2, Name: "プレイヤー2", Monster: player2Monster},

		SelectedMoves: SelectedMoves{},
		Guards:        Guards{},

		MovePP: PlayerMovePP{
			Player1: createMovePP(player1Monster.Moves),
			Player2: createMovePP(player2Monster.Moves),
		},

		Logs:   []string{"バトル開始！"},
		Winner: nil,
	}, true
}
