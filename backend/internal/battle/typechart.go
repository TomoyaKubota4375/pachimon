package battle

// GetTypeMultiplier はfeatures/battle/mechanics/typeChart.tsの移植。
// BLUE>RED>GREEN>BLUEの三すくみ、WHITE<->BLACKはお互いに2倍。YELLOWは今のところ相性なし。
func GetTypeMultiplier(attackType, defenseType BattleType) float64 {
	if attackType == defenseType {
		return 1
	}

	strong := (attackType == TypeBlue && defenseType == TypeRed) ||
		(attackType == TypeRed && defenseType == TypeGreen) ||
		(attackType == TypeGreen && defenseType == TypeBlue) ||
		(attackType == TypeWhite && defenseType == TypeBlack) ||
		(attackType == TypeBlack && defenseType == TypeWhite)

	if strong {
		return 2.0
	}

	weak := (attackType == TypeRed && defenseType == TypeBlue) ||
		(attackType == TypeGreen && defenseType == TypeRed) ||
		(attackType == TypeBlue && defenseType == TypeGreen)

	if weak {
		return 0.5
	}

	return 1
}
