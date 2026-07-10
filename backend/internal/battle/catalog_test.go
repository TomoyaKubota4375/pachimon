package battle

import "testing"

func TestMonsters_NoDuplicateIDs(t *testing.T) {
	seen := map[string]bool{}

	for _, m := range Monsters {
		if seen[m.ID] {
			t.Fatalf("duplicate monster id: %s", m.ID)
		}
		seen[m.ID] = true
	}
}

func TestMoves_NoDuplicateIDs(t *testing.T) {
	seen := map[MoveID]bool{}

	for _, mv := range Moves {
		if seen[mv.ID] {
			t.Fatalf("duplicate move id: %s", mv.ID)
		}
		seen[mv.ID] = true
	}
}

func TestMonsters_AllMovesResolve(t *testing.T) {
	for _, m := range Monsters {
		if len(m.Moves) == 0 {
			t.Errorf("monster %s has no moves", m.ID)
		}

		for _, moveID := range m.Moves {
			if _, ok := FindMove(moveID); !ok {
				t.Errorf("monster %s references unknown move %s", m.ID, moveID)
			}
		}
	}
}

func TestMonsters_StatsArePositive(t *testing.T) {
	for _, m := range Monsters {
		if m.MaxHP <= 0 {
			t.Errorf("monster %s has non-positive maxHp: %d", m.ID, m.MaxHP)
		}
	}
}

func TestNewMonster_WorksForEveryCatalogEntry(t *testing.T) {
	for _, m := range Monsters {
		monster, ok := NewMonster(m.ID)
		if !ok {
			t.Errorf("NewMonster failed for catalog entry %s", m.ID)
			continue
		}

		if monster.HP != monster.MaxHP {
			t.Errorf("monster %s: HP should start at MaxHP (%d), got %d", m.ID, monster.MaxHP, monster.HP)
		}
	}
}
