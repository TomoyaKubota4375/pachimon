package battle

import "math"

const (
	minStage = -6
	maxStage = 6
)

func clampStage(stage int) int {
	if stage < minStage {
		return minStage
	}
	if stage > maxStage {
		return maxStage
	}
	return stage
}

// ApplyStageChange はfeatures/battle/mechanics/statStage.tsの移植。
func ApplyStageChange(stages StatStages, stat StatName, delta int) StatStages {
	next := stages

	switch stat {
	case StatAttack:
		next.Attack = clampStage(stages.Attack + delta)
	case StatDefense:
		next.Defense = clampStage(stages.Defense + delta)
	case StatSpeed:
		next.Speed = clampStage(stages.Speed + delta)
	case StatAccuracy:
		next.Accuracy = clampStage(stages.Accuracy + delta)
	case StatEvasion:
		next.Evasion = clampStage(stages.Evasion + delta)
	}

	return next
}

func getStageValue(stages StatStages, stat StatName) int {
	switch stat {
	case StatAttack:
		return stages.Attack
	case StatDefense:
		return stages.Defense
	case StatSpeed:
		return stages.Speed
	case StatAccuracy:
		return stages.Accuracy
	case StatEvasion:
		return stages.Evasion
	}
	return 0
}

// GetModifiedStat はランク補正後の実数値。
func GetModifiedStat(baseStat int, stage int) int {
	if stage >= 0 {
		return int(math.Floor(float64(baseStat) * (float64(2+stage) / 2)))
	}

	return int(math.Floor(float64(baseStat) * (2 / float64(2+intAbs(stage)))))
}

// GetAccuracyMultiplier は命中率・回避率専用の補正倍率。
func GetAccuracyMultiplier(stage int) float64 {
	if stage >= 0 {
		return float64(3+stage) / 3
	}

	return 3 / float64(3+intAbs(stage))
}

func intAbs(v int) int {
	if v < 0 {
		return -v
	}
	return v
}
