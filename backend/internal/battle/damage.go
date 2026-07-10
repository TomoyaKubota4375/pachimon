package battle

import (
	"math"
	"math/rand"
)

// DamageResult はダメージ計算の結果。
type DamageResult struct {
	Damage   int
	Critical bool
}

func getBurnModifiedAttack(attack int, attacker BattleMonster) int {
	if attacker.MainStatus == nil || attacker.MainStatus.Condition != StatusBurn {
		return attack
	}

	return maxInt(1, attack/2)
}

func getStabMultiplier(attacker BattleMonster, moveType BattleType) float64 {
	if attacker.Type == moveType {
		return 1.5
	}
	return 1
}

func isCriticalHit() bool {
	return rand.Float64() < 1.0/16
}

func getCriticalMultiplier(critical bool) float64 {
	if critical {
		return 1.5
	}
	return 1
}

func getRandomMultiplier() float64 {
	return 0.85 + rand.Float64()*0.15
}

// CalculateDamageParams はCalculateDamageへの入力。
type CalculateDamageParams struct {
	Attacker BattleMonster
	Defender BattleMonster
	Power    int
	MoveType BattleType
}

// CalculateDamage はfeatures/battle/mechanics/damage.tsの移植。
// ダメージ = (技の威力 + 攻撃 - 防御) × タイプ相性 × タイプ一致 × 急所 × 乱数(0.85〜1.0)
func CalculateDamage(params CalculateDamageParams) DamageResult {
	if params.Power <= 0 {
		return DamageResult{Damage: 0, Critical: false}
	}

	modifiedAttack := GetModifiedStat(params.Attacker.Attack, params.Attacker.StatStages.Attack)
	attack := getBurnModifiedAttack(modifiedAttack, params.Attacker)
	defense := GetModifiedStat(params.Defender.Defense, params.Defender.StatStages.Defense)

	typeMultiplier := GetTypeMultiplier(params.MoveType, params.Defender.Type)
	stabMultiplier := getStabMultiplier(params.Attacker, params.MoveType)

	critical := isCriticalHit()
	criticalMultiplier := getCriticalMultiplier(critical)
	randomMultiplier := getRandomMultiplier()

	baseDamage := params.Power + attack - defense
	damage := maxInt(1, baseDamage)

	final := int(math.Floor(
		float64(damage) * typeMultiplier * stabMultiplier * criticalMultiplier * randomMultiplier,
	))

	return DamageResult{
		Damage:   maxInt(1, final),
		Critical: critical,
	}
}

func maxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}
