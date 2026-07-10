// Package battle は frontend/features/battle 配下のロジックをそのままGoに移植したもの。
// フロント側のTypeScriptと1対1で対応させているので、フロントのロジックを直すときはこちらも合わせて直すこと。
package battle

// BattleType はモンスター・技のタイプ。
type BattleType string

const (
	TypeBlue   BattleType = "blue"
	TypeRed    BattleType = "red"
	TypeGreen  BattleType = "green"
	TypeYellow BattleType = "yellow"
	TypeWhite  BattleType = "white"
	TypeBlack  BattleType = "black"
)

// PlayerID はバトルの2陣営。
type PlayerID string

const (
	Player1 PlayerID = "player1"
	Player2 PlayerID = "player2"
)

// MoveID は技のID（moves.go で定義される技のidと対応）。
type MoveID string

// BattleEffectAnimation は演出の種類。
type BattleEffectAnimation string

const (
	AnimationRedAttack    BattleEffectAnimation = "red-attack"
	AnimationBlueAttack   BattleEffectAnimation = "blue-attack"
	AnimationYellowAttack BattleEffectAnimation = "yellow-attack"
	AnimationWhiteAttack  BattleEffectAnimation = "white-attack"
	AnimationBlackAttack  BattleEffectAnimation = "black-attack"
	AnimationNormalAttack BattleEffectAnimation = "normal-attack"
	AnimationBuff         BattleEffectAnimation = "buff"
	AnimationDebuff       BattleEffectAnimation = "debuff"
	AnimationStatus       BattleEffectAnimation = "status"
	AnimationGuard        BattleEffectAnimation = "guard"
)

// MainStatusCondition は本状態異常。
type MainStatusCondition string

const (
	StatusBurn      MainStatusCondition = "burn"
	StatusParalysis MainStatusCondition = "paralysis"
	StatusPoison    MainStatusCondition = "poison"
	StatusBadPoison MainStatusCondition = "bad-poison"
	StatusFreeze    MainStatusCondition = "freeze"
	StatusSleep     MainStatusCondition = "sleep"
)

// VolatileStatusCondition は状態変化（こんらんのみ）。
type VolatileStatusCondition string

const (
	StatusConfusion VolatileStatusCondition = "confusion"
)

// StatName は能力値の種類。
type StatName string

const (
	StatAttack   StatName = "attack"
	StatDefense  StatName = "defense"
	StatSpeed    StatName = "speed"
	StatAccuracy StatName = "accuracy"
	StatEvasion  StatName = "evasion"
)

// StatStages は各能力のランク補正（-6〜+6）。
type StatStages struct {
	Attack   int `json:"attack"`
	Defense  int `json:"defense"`
	Speed    int `json:"speed"`
	Accuracy int `json:"accuracy"`
	Evasion  int `json:"evasion"`
}

func newStatStages() StatStages {
	return StatStages{}
}

// MonsterData はモンスターの固定データ（種族値）。
type MonsterData struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	Type      BattleType `json:"type"`
	ImagePath string     `json:"imagePath"`
	MaxHP     int        `json:"maxHp"`
	Attack    int        `json:"attack"`
	Defense   int        `json:"defense"`
	Speed     int        `json:"speed"`
	Moves     []MoveID   `json:"moves"`
}

// MainStatusState は現在の本状態異常。
type MainStatusState struct {
	Condition       MainStatusCondition `json:"condition"`
	RemainingTurns  *int                `json:"remainingTurns,omitempty"`
	ToxicTurnCount  *int                `json:"toxicTurnCount,omitempty"`
	FreezeTurnCount *int                `json:"freezeTurnCount,omitempty"`
}

// VolatileStatusState は現在の状態変化。
type VolatileStatusState struct {
	Condition      VolatileStatusCondition `json:"condition"`
	RemainingTurns int                     `json:"remainingTurns"`
}

// BattleMonster はバトル中のモンスター（固定データ＋現在のHP等）。
type BattleMonster struct {
	MonsterData
	HP             int                  `json:"hp"`
	StatStages     StatStages           `json:"statStages"`
	MainStatus     *MainStatusState     `json:"mainStatus"`
	VolatileStatus *VolatileStatusState `json:"volatileStatus"`
}

// BattlePlayer は1陣営（プレイヤー名＋出しているモンスター）。
type BattlePlayer struct {
	ID      PlayerID      `json:"id"`
	Name    string        `json:"name"`
	Monster BattleMonster `json:"monster"`
}

// ----- 技の効果 -----

// MoveEffectType は効果の種類。
type MoveEffectType string

const (
	EffectDamage MoveEffectType = "damage"
	EffectStat   MoveEffectType = "stat"
	EffectStatus MoveEffectType = "status"
	EffectGuard  MoveEffectType = "guard"
)

// EffectTarget は効果の対象。
type EffectTarget string

const (
	TargetSelf     EffectTarget = "self"
	TargetOpponent EffectTarget = "opponent"
)

// MoveEffect は技が持つ効果1つぶん。全フィールドを持つが、Typeに応じて使うフィールドが変わる
// （TypeScript側のユニオン型 DamageEffect | StatEffect | StatusEffect | GuardEffect に対応）。
type MoveEffect struct {
	Type MoveEffectType `json:"type"`

	// damage
	Power int `json:"power,omitempty"`

	// stat
	Target EffectTarget `json:"target,omitempty"`
	Stat   StatName     `json:"stat,omitempty"`
	Stages int          `json:"stages,omitempty"`
	Chance int          `json:"chance,omitempty"`

	// status（TargetもStatusで使う）
	Condition string `json:"condition,omitempty"`
}

// BattleMove は技の固定データ。
type BattleMove struct {
	ID        MoveID                `json:"id"`
	Name      string                `json:"name"`
	Type      BattleType            `json:"type"`
	MaxPP     int                   `json:"maxPp"`
	Accuracy  int                   `json:"accuracy"`
	Priority  int                   `json:"priority"`
	Animation BattleEffectAnimation `json:"animation"`
	Effects   []MoveEffect          `json:"effects"`
}

// BattlePhase はバトル全体の進行状況。
type BattlePhase string

const (
	PhaseSelecting BattlePhase = "selecting"
	PhaseFinished  BattlePhase = "finished"
)

// SelectedMoves は両陣営が選んだ技（未選択はnil）。
type SelectedMoves struct {
	Player1 *MoveID `json:"player1"`
	Player2 *MoveID `json:"player2"`
}

// Guards は「みをまもる」等ガード技を出したかどうか（そのターンだけ有効）。
type Guards struct {
	Player1 bool `json:"player1"`
	Player2 bool `json:"player2"`
}

// MovePP は残りPP（技IDごと）。
type MovePP map[MoveID]int

// PlayerMovePP は両陣営の残りPP。
type PlayerMovePP struct {
	Player1 MovePP `json:"player1"`
	Player2 MovePP `json:"player2"`
}

// BattleState はバトル全体の状態。イミュータブルに扱う（更新のたびに新しい値を作る）。
type BattleState struct {
	Turn  int         `json:"turn"`
	Phase BattlePhase `json:"phase"`

	Player1 BattlePlayer `json:"player1"`
	Player2 BattlePlayer `json:"player2"`

	SelectedMoves SelectedMoves `json:"selectedMoves"`
	Guards        Guards        `json:"guards"`
	MovePP        PlayerMovePP  `json:"movePp"`

	Logs   []string  `json:"logs"`
	Winner *PlayerID `json:"winner"`
}

// Get はplayerIDに対応するBattlePlayerを返す。
func (s *BattleState) Get(id PlayerID) BattlePlayer {
	if id == Player1 {
		return s.Player1
	}
	return s.Player2
}

// Set はplayerIDに対応するBattlePlayerを更新した新しいBattleStateを返す。
func (s BattleState) Set(id PlayerID, player BattlePlayer) BattleState {
	if id == Player1 {
		s.Player1 = player
	} else {
		s.Player2 = player
	}
	return s
}
