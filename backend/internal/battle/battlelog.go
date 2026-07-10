package battle

import "strconv"

// getStatName はfeatures/battle/engine/battleLog.tsのgetStatNameの移植。
func getStatName(stat StatName) string {
	switch stat {
	case StatAttack:
		return "こうげき"
	case StatDefense:
		return "ぼうぎょ"
	case StatSpeed:
		return "すばやさ"
	case StatAccuracy:
		return "命中"
	case StatEvasion:
		return "回避"
	}
	return string(stat)
}

// getStatusName は本状態異常・状態変化どちらの文字列も受け付ける
// （TS側は2箇所に似た関数があるが、ここでは1つにまとめている）。
func getStatusName(condition string) string {
	switch MainStatusCondition(condition) {
	case StatusPoison:
		return "どく"
	case StatusBadPoison:
		return "もうどく"
	case StatusBurn:
		return "やけど"
	case StatusParalysis:
		return "まひ"
	case StatusSleep:
		return "ねむり"
	case StatusFreeze:
		return "こおり"
	}

	if VolatileStatusCondition(condition) == StatusConfusion {
		return "こんらん"
	}

	return condition
}

func createDamageLog(monsterName string, damage int) string {
	return monsterName + " に " + strconv.Itoa(damage) + " ダメージ！"
}

func createCriticalLog() string {
	return "急所に当たった！"
}

func createGuardLog(monsterName string) string {
	return monsterName + " は身を守っている！"
}

func createGuardSuccessLog(monsterName string) string {
	return monsterName + " は攻撃を防いだ！"
}

func createStatChangeLog(monsterName string, stat StatName, stages int) string {
	direction := "下がった"
	if stages > 0 {
		direction = "上がった"
	}

	return monsterName + " の" + getStatName(stat) + "が" + direction + "！"
}

func createAlreadyMainStatusLog(monsterName string) string {
	return monsterName + " はすでに状態異常になっている！"
}

func createAlreadyVolatileStatusLog(monsterName string) string {
	return monsterName + " はすでに状態変化している！"
}

func createMainStatusLog(monsterName string, condition MainStatusCondition) string {
	return monsterName + " は" + getStatusName(string(condition)) + "状態になった！"
}

func createVolatileStatusLog(monsterName string, condition VolatileStatusCondition) string {
	return monsterName + " は" + getStatusName(string(condition)) + "した！"
}
