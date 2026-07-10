package battle

import "testing"

func TestNewBattleState_UnknownMonster(t *testing.T) {
	if _, ok := NewBattleState("bonmon", "does-not-exist"); ok {
		t.Fatal("expected ok=false for unknown monster id")
	}
}

func TestFullBattle_EndsWithAWinner(t *testing.T) {
	state, ok := NewBattleState("ikarimon", "bonmon")
	if !ok {
		t.Fatal("expected ok=true for known monster ids")
	}

	if state.Turn != 1 || state.Phase != PhaseSelecting {
		t.Fatalf("unexpected initial state: turn=%d phase=%s", state.Turn, state.Phase)
	}

	ikariMoves := []MoveID{"ikari-power-up", "ikari-heavy-blow", "ikari-burn"}
	bonMoves := []MoveID{"bon-quick-hit", "bon-speed-up", "bon-flash"}

	for i := 0; i < 200; i++ {
		if state.Phase == PhaseFinished {
			break
		}

		state = SelectMove(state, Player1, ikariMoves[i%len(ikariMoves)])

		if state.Phase == PhaseFinished {
			break
		}

		state = SelectMove(state, Player2, bonMoves[i%len(bonMoves)])
	}

	if state.Phase != PhaseFinished {
		t.Fatalf("battle did not finish within 200 turns, hp1=%d hp2=%d", state.Player1.Monster.HP, state.Player2.Monster.HP)
	}

	if state.Winner == nil {
		t.Fatal("expected a winner once phase is finished")
	}

	if state.Player1.Monster.HP > 0 && state.Player2.Monster.HP > 0 {
		t.Fatal("battle finished but both monsters still have HP")
	}
}

func TestCalculateDamage_TypeAdvantageDoublesRoughly(t *testing.T) {
	attacker := BattleMonster{MonsterData: MonsterData{Type: TypeBlue, Attack: 30}}
	defenderWeak := BattleMonster{MonsterData: MonsterData{Type: TypeRed, Defense: 20}}
	defenderNeutral := BattleMonster{MonsterData: MonsterData{Type: TypeWhite, Defense: 20}}

	var strongTotal, neutralTotal int
	const trials = 500

	for i := 0; i < trials; i++ {
		strongTotal += CalculateDamage(CalculateDamageParams{
			Attacker: attacker, Defender: defenderWeak, Power: 40, MoveType: TypeBlue,
		}).Damage

		neutralTotal += CalculateDamage(CalculateDamageParams{
			Attacker: attacker, Defender: defenderNeutral, Power: 40, MoveType: TypeBlue,
		}).Damage
	}

	strongAvg := float64(strongTotal) / trials
	neutralAvg := float64(neutralTotal) / trials

	ratio := strongAvg / neutralAvg

	if ratio < 1.8 || ratio > 2.2 {
		t.Fatalf("expected roughly 2x damage for type advantage, got ratio=%.2f (strongAvg=%.1f neutralAvg=%.1f)", ratio, strongAvg, neutralAvg)
	}
}

func TestApplyStageChange_ClampsToRange(t *testing.T) {
	stages := StatStages{Attack: 5}

	stages = ApplyStageChange(stages, StatAttack, 5)
	if stages.Attack != 6 {
		t.Fatalf("expected clamp to 6, got %d", stages.Attack)
	}

	stages = ApplyStageChange(stages, StatAttack, -20)
	if stages.Attack != -6 {
		t.Fatalf("expected clamp to -6, got %d", stages.Attack)
	}
}
