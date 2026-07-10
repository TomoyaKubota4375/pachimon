package battle

// Moves はfeatures/battle/data/moves.tsのmovesをそのまま移植したもの。
// フロントのmoves.tsが更新されたら scripts/gen-battle-data.cjs を再実行して同期すること。
// (このファイルは自動生成。手で編集しない)
var Moves = []BattleMove{
	{
		ID: "bon-quick-hit", Name: "ボン速タックル", Type: TypeWhite,
		MaxPP: 25, Accuracy: 100, Priority: 1, Animation: AnimationWhiteAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 35},
		},
	},
	{
		ID: "bon-speed-up", Name: "ボン加速", Type: TypeWhite,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatSpeed, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "bon-flash", Name: "ボンまぶし", Type: TypeWhite,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationWhiteAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 45},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAccuracy, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "kanji-wave", Name: "漢字ウェーブ", Type: TypeBlue,
		MaxPP: 25, Accuracy: 100, Priority: 0, Animation: AnimationBlueAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 40},
		},
	},
	{
		ID: "kanji-dodge", Name: "読めない動き", Type: TypeBlue,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatEvasion, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "kanji-blur", Name: "画数ぶれ", Type: TypeBlue,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAccuracy, Stages: -1, Chance: 100},
		},
	},
	{
		ID: "hiroya-static", Name: "ヒロヤ静電気", Type: TypeGreen,
		MaxPP: 20, Accuracy: 95, Priority: 0, Animation: AnimationYellowAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 45},
		},
	},
	{
		ID: "hiroya-guard-up", Name: "ヒロヤ硬化", Type: TypeGreen,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatDefense, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "hiroya-paralyze", Name: "ヒロヤビリビリ", Type: TypeGreen,
		MaxPP: 15, Accuracy: 90, Priority: 0, Animation: AnimationYellowAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusParalysis), Chance: 30},
		},
	},
	{
		ID: "sympathy-pressure", Name: "共感圧", Type: TypeBlack,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAttack, Stages: -1, Chance: 100},
		},
	},
	{
		ID: "sympathy-slow", Name: "空気読ませ", Type: TypeBlack,
		MaxPP: 20, Accuracy: 95, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetOpponent, Stat: StatSpeed, Stages: -1, Chance: 100},
		},
	},
	{
		ID: "sympathy-dark-hit", Name: "共感クラッシュ", Type: TypeBlack,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationBlackAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 50},
		},
	},
	{
		ID: "ikari-power-up", Name: "怒りチャージ", Type: TypeRed,
		MaxPP: 20, Accuracy: 40, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "ikari-heavy-blow", Name: "激おこぶん殴り", Type: TypeRed,
		MaxPP: 15, Accuracy: 90, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 70},
		},
	},
	{
		ID: "ikari-burn", Name: "怒髪ファイア", Type: TypeRed,
		MaxPP: 10, Accuracy: 85, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 55},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusBurn), Chance: 30},
		},
	},
	{
		ID: "shizuku-splash", Name: "しずくスプラッシュ", Type: TypeBlue,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBlueAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 45},
		},
	},
	{
		ID: "shizuku-focus", Name: "しずく集中", Type: TypeBlue,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "shizuku-mist", Name: "しずくミスト", Type: TypeBlue,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatSpeed, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "shizuku-guard", Name: "しずくガード", Type: TypeBlue,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "tsuna-rush", Name: "つなラッシュ", Type: TypeBlue,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationBlueAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 55},
		},
	},
	{
		ID: "tsuna-accel", Name: "つなアクセル", Type: TypeBlue,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatSpeed, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "tsuna-splashdown", Name: "つなスプラッシュダウン", Type: TypeBlue,
		MaxPP: 15, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 40},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAccuracy, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "tsuna-guard", Name: "つなガード", Type: TypeBlue,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "kori-blow", Name: "こおりブロー", Type: TypeBlue,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBlueAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 35},
		},
	},
	{
		ID: "kori-harden", Name: "こおり硬化", Type: TypeBlue,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatDefense, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "kori-freeze-breath", Name: "こおりのいき", Type: TypeBlue,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationBlueAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusFreeze), Chance: 20},
		},
	},
	{
		ID: "kori-guard", Name: "こおりガード", Type: TypeBlue,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "moe-flame", Name: "もえフレイム", Type: TypeRed,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 45},
		},
	},
	{
		ID: "moe-fired-up", Name: "もえ気合い", Type: TypeRed,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "moe-cinder", Name: "もえ火の粉", Type: TypeRed,
		MaxPP: 15, Accuracy: 90, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusBurn), Chance: 25},
		},
	},
	{
		ID: "moe-guard", Name: "もえガード", Type: TypeRed,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "kaji-blaze-dash", Name: "かじブレイズダッシュ", Type: TypeRed,
		MaxPP: 15, Accuracy: 90, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 55},
		},
	},
	{
		ID: "kaji-quickstep", Name: "かじクイックステップ", Type: TypeRed,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatSpeed, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "kaji-spark", Name: "かじスパーク", Type: TypeRed,
		MaxPP: 15, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 35},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAccuracy, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "kaji-guard", Name: "かじガード", Type: TypeRed,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "yake-smolder", Name: "やけくすぶり", Type: TypeRed,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 35},
		},
	},
	{
		ID: "yake-toughen", Name: "やけ根性", Type: TypeRed,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatDefense, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "yake-scorch", Name: "やけスコーチ", Type: TypeRed,
		MaxPP: 10, Accuracy: 85, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusBurn), Chance: 25},
		},
	},
	{
		ID: "yake-guard", Name: "やけガード", Type: TypeRed,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "midori-whip", Name: "ゆめならば", Type: TypeGreen,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationYellowAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 45},
		},
	},
	{
		ID: "midori-growth", Name: "どれほど", Type: TypeGreen,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "midori-thorns", Name: "よかったでしょう", Type: TypeGreen,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatDefense, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "midori-guard", Name: "みどりガード", Type: TypeGreen,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "tsuru-strike", Name: "つるストライク", Type: TypeGreen,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationYellowAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 55},
		},
	},
	{
		ID: "tsuru-vine-dash", Name: "つるダッシュ", Type: TypeGreen,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatSpeed, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "tsuru-bind", Name: "つるバインド", Type: TypeGreen,
		MaxPP: 15, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 35},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatSpeed, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "tsuru-guard", Name: "つるガード", Type: TypeGreen,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "moku-slam", Name: "もくスラム", Type: TypeGreen,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationYellowAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 35},
		},
	},
	{
		ID: "moku-bark-up", Name: "もくじゅ強化", Type: TypeGreen,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatDefense, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "moku-spore", Name: "もくほうし", Type: TypeGreen,
		MaxPP: 10, Accuracy: 85, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusSleep), Chance: 20},
		},
	},
	{
		ID: "moku-guard", Name: "もくガード", Type: TypeGreen,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "hikari-beam", Name: "ひかりビーム", Type: TypeWhite,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationWhiteAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 45},
		},
	},
	{
		ID: "hikari-focus", Name: "ひかり集中", Type: TypeWhite,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "hikari-glare", Name: "ひかりグレア", Type: TypeWhite,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAccuracy, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "hikari-guard", Name: "ひかりガード", Type: TypeWhite,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "kira-flash-dash", Name: "きらフラッシュダッシュ", Type: TypeWhite,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationWhiteAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 55},
		},
	},
	{
		ID: "kira-shine", Name: "きらシャイン", Type: TypeWhite,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatSpeed, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "kira-dazzle", Name: "きらダズル", Type: TypeWhite,
		MaxPP: 15, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 35},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAccuracy, Stages: -1, Chance: 35},
		},
	},
	{
		ID: "kira-guard", Name: "きらガード", Type: TypeWhite,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "yuki-blow", Name: "ゆきブロー", Type: TypeWhite,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationWhiteAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 35},
		},
	},
	{
		ID: "yuki-harden", Name: "ゆき硬化", Type: TypeWhite,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatDefense, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "yuki-chill", Name: "ゆきチル", Type: TypeWhite,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationWhiteAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusFreeze), Chance: 20},
		},
	},
	{
		ID: "yuki-guard", Name: "ゆきガード", Type: TypeWhite,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "yami-strike", Name: "やみストライク", Type: TypeBlack,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBlackAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 45},
		},
	},
	{
		ID: "yami-focus", Name: "やみ集中", Type: TypeBlack,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "yami-curse", Name: "やみの呪い", Type: TypeBlack,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAttack, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "yami-guard", Name: "やみガード", Type: TypeBlack,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "kage-dash", Name: "かげダッシュ", Type: TypeBlack,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationBlackAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 55},
		},
	},
	{
		ID: "kage-slip", Name: "かげスリップ", Type: TypeBlack,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatEvasion, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "kage-drain", Name: "かげドレイン", Type: TypeBlack,
		MaxPP: 15, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 35},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatDefense, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "kage-guard", Name: "かげガード", Type: TypeBlack,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "ja-crush", Name: "じゃクラッシュ", Type: TypeBlack,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBlackAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 35},
		},
	},
	{
		ID: "ja-harden", Name: "じゃ硬化", Type: TypeBlack,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatDefense, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "ja-poison-fang", Name: "じゃどくキバ", Type: TypeBlack,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationBlackAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusPoison), Chance: 25},
		},
	},
	{
		ID: "ja-guard", Name: "じゃガード", Type: TypeBlack,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "mizu-tackle", Name: "みずタックル", Type: TypeBlue,
		MaxPP: 25, Accuracy: 100, Priority: 0, Animation: AnimationBlueAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 40},
		},
	},
	{
		ID: "mizu-guard-up", Name: "みず防御アップ", Type: TypeBlue,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatDefense, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "mizu-chill", Name: "みずチル", Type: TypeBlue,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatSpeed, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "mizu-guard", Name: "みずガード", Type: TypeBlue,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "honoo-tackle", Name: "ほのおタックル", Type: TypeRed,
		MaxPP: 25, Accuracy: 100, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 40},
		},
	},
	{
		ID: "honoo-fired-up", Name: "ほのお気合い", Type: TypeRed,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "honoo-ember", Name: "ほのおの火の粉", Type: TypeRed,
		MaxPP: 15, Accuracy: 90, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusBurn), Chance: 25},
		},
	},
	{
		ID: "honoo-guard", Name: "ほのおガード", Type: TypeRed,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "kusa-tackle", Name: "くさタックル", Type: TypeGreen,
		MaxPP: 25, Accuracy: 100, Priority: 0, Animation: AnimationYellowAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 40},
		},
	},
	{
		ID: "kusa-growth", Name: "くさ成長", Type: TypeGreen,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "kusa-vine-whip", Name: "くさのつるムチ", Type: TypeGreen,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatDefense, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "kusa-guard", Name: "くさガード", Type: TypeGreen,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "haku-tackle", Name: "はくタックル", Type: TypeWhite,
		MaxPP: 25, Accuracy: 100, Priority: 0, Animation: AnimationWhiteAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 40},
		},
	},
	{
		ID: "haku-focus", Name: "はく集中", Type: TypeWhite,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "haku-glare", Name: "はくグレア", Type: TypeWhite,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAccuracy, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "haku-guard", Name: "はくガード", Type: TypeWhite,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "koku-tackle", Name: "こくタックル", Type: TypeBlack,
		MaxPP: 25, Accuracy: 100, Priority: 0, Animation: AnimationBlackAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 40},
		},
	},
	{
		ID: "koku-focus", Name: "こく集中", Type: TypeBlack,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "koku-shadow-bite", Name: "こくのシャドウバイト", Type: TypeBlack,
		MaxPP: 15, Accuracy: 95, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatDefense, Stages: -1, Chance: 30},
		},
	},
	{
		ID: "koku-guard", Name: "こくガード", Type: TypeBlack,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "denki-tackle", Name: "でんきタックル", Type: TypeYellow,
		MaxPP: 25, Accuracy: 100, Priority: 0, Animation: AnimationYellowAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 40},
		},
	},
	{
		ID: "denki-charge", Name: "でんきチャージ", Type: TypeYellow,
		MaxPP: 20, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatSpeed, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "denki-shock", Name: "でんきショック", Type: TypeYellow,
		MaxPP: 15, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 30},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusParalysis), Chance: 25},
		},
	},
	{
		ID: "denki-guard", Name: "でんきガード", Type: TypeYellow,
		MaxPP: 15, Accuracy: 100, Priority: 1, Animation: AnimationGuard,
		Effects: []MoveEffect{
			{Type: EffectGuard},
		},
	},
	{
		ID: "renji-nuke", Name: "げきチンレンジ", Type: TypeRed,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 90},
		},
	},
	{
		ID: "renji-overheat", Name: "オーバーヒート", Type: TypeRed,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 2, Chance: 100},
		},
	},
	{
		ID: "wifi-lag-spike", Name: "ラグスパイク", Type: TypeYellow,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 60},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatSpeed, Stages: -2, Chance: 100},
		},
	},
	{
		ID: "wifi-full-bars", Name: "フルバー", Type: TypeYellow,
		MaxPP: 15, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAccuracy, Stages: 2, Chance: 100},
		},
	},
	{
		ID: "shimekiri-panic", Name: "しめきりパニック", Type: TypeBlack,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBlackAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 85},
		},
	},
	{
		ID: "shimekiri-overtime", Name: "てつやモード", Type: TypeBlack,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 2, Chance: 100},
		},
	},
	{
		ID: "energy-burst", Name: "エナジーバースト", Type: TypeRed,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 75},
		},
	},
	{
		ID: "energy-overdrive", Name: "オーバードライブ", Type: TypeRed,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatSpeed, Stages: 2, Chance: 100},
		},
	},
	{
		ID: "printer-jam-slam", Name: "ジャムスラム", Type: TypeWhite,
		MaxPP: 10, Accuracy: 75, Priority: 0, Animation: AnimationWhiteAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 95},
		},
	},
	{
		ID: "printer-double-sided", Name: "りょうめんいんさつ", Type: TypeWhite,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationWhiteAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 40},
			{Type: EffectDamage, Power: 40},
		},
	},
	{
		ID: "juken-desperation", Name: "いっきいっかん", Type: TypeBlack,
		MaxPP: 10, Accuracy: 70, Priority: 0, Animation: AnimationBlackAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 90},
		},
	},
	{
		ID: "juken-cram", Name: "つめこみあんき", Type: TypeBlack,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 2, Chance: 100},
		},
	},
	{
		ID: "overclock-surge", Name: "オーバークロックサージ", Type: TypeYellow,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationYellowAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 80},
		},
	},
	{
		ID: "overclock-boost", Name: "デュアルブースト", Type: TypeYellow,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatSpeed, Stages: 1, Chance: 100},
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "zangyou-breakdown", Name: "ぶちょうげきりん", Type: TypeBlack,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 75},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAttack, Stages: -1, Chance: 50},
		},
	},
	{
		ID: "zangyou-endure", Name: "こんじょう", Type: TypeBlack,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatDefense, Stages: 2, Chance: 100},
		},
	},
	{
		ID: "shuen-collapse", Name: "しゅうえんのほうかい", Type: TypeBlack,
		MaxPP: 10, Accuracy: 95, Priority: 0, Animation: AnimationBlackAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 100},
		},
	},
	{
		ID: "shuen-despair", Name: "ぜつぼうのせんこく", Type: TypeBlack,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAttack, Stages: -2, Chance: 100},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatDefense, Stages: -2, Chance: 100},
		},
	},
	{
		ID: "shuen-eclipse", Name: "かいめつのしょくへん", Type: TypeBlack,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 60},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAccuracy, Stages: -2, Chance: 60},
		},
	},
	{
		ID: "ryu-tidal-crush", Name: "げんこはかい", Type: TypeBlue,
		MaxPP: 10, Accuracy: 95, Priority: 0, Animation: AnimationBlueAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 95},
		},
	},
	{
		ID: "ryu-ancient-roar", Name: "たいこのほうこう", Type: TypeBlue,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 2, Chance: 100},
			{Type: EffectStat, Target: TargetSelf, Stat: StatDefense, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "ryu-abyss-breath", Name: "しんえんのぶれす", Type: TypeBlue,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationBlueAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 55},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusFreeze), Chance: 40},
		},
	},
	{
		ID: "goku-radiant-dive", Name: "こうかダイブ", Type: TypeWhite,
		MaxPP: 10, Accuracy: 95, Priority: 0, Animation: AnimationWhiteAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 90},
		},
	},
	{
		ID: "goku-wing-gale", Name: "しんくうのつばさ", Type: TypeWhite,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatSpeed, Stages: 2, Chance: 100},
		},
	},
	{
		ID: "goku-holy-light", Name: "せいなるひかり", Type: TypeWhite,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 50},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatAccuracy, Stages: -2, Chance: 50},
		},
	},
	{
		ID: "daichi-quake", Name: "だいちしんどう", Type: TypeGreen,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationYellowAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 85},
		},
	},
	{
		ID: "daichi-bulwark", Name: "だいちのとりで", Type: TypeGreen,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatDefense, Stages: 2, Chance: 100},
		},
	},
	{
		ID: "daichi-root-prison", Name: "こんじょうのごく", Type: TypeGreen,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 40},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatSpeed, Stages: -2, Chance: 60},
		},
	},
	{
		ID: "kenja-inferno", Name: "だいえんじょう", Type: TypeRed,
		MaxPP: 10, Accuracy: 95, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 105},
		},
	},
	{
		ID: "kenja-flame-mastery", Name: "えんじょうのごうぎ", Type: TypeRed,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 2, Chance: 100},
		},
	},
	{
		ID: "kenja-cinderstorm", Name: "はいじんのあらし", Type: TypeRed,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationRedAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 50},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusBurn), Chance: 60},
		},
	},
	{
		ID: "raijin-thunderstrike", Name: "らいじんげき", Type: TypeYellow,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationYellowAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 92},
		},
	},
	{
		ID: "raijin-overcharge", Name: "らいめいじゅうでん", Type: TypeYellow,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatSpeed, Stages: 2, Chance: 100},
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 1, Chance: 100},
		},
	},
	{
		ID: "raijin-static-field", Name: "せいでんばりあ", Type: TypeYellow,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 50},
			{Type: EffectStatus, Target: TargetOpponent, Condition: string(StatusParalysis), Chance: 55},
		},
	},
	{
		ID: "joo-void-strike", Name: "こくうのいちげき", Type: TypeBlack,
		MaxPP: 10, Accuracy: 95, Priority: 0, Animation: AnimationBlackAttack,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 98},
		},
	},
	{
		ID: "joo-dark-crown", Name: "あんこくのおうかん", Type: TypeBlack,
		MaxPP: 10, Accuracy: 100, Priority: 0, Animation: AnimationBuff,
		Effects: []MoveEffect{
			{Type: EffectStat, Target: TargetSelf, Stat: StatAttack, Stages: 2, Chance: 100},
		},
	},
	{
		ID: "joo-abyssal-curse", Name: "しんえんののろい", Type: TypeBlack,
		MaxPP: 10, Accuracy: 90, Priority: 0, Animation: AnimationDebuff,
		Effects: []MoveEffect{
			{Type: EffectDamage, Power: 45},
			{Type: EffectStat, Target: TargetOpponent, Stat: StatDefense, Stages: -2, Chance: 55},
		},
	},
}

var moveByID = buildMoveIndex()

func buildMoveIndex() map[MoveID]BattleMove {
	index := make(map[MoveID]BattleMove, len(Moves))
	for _, move := range Moves {
		index[move.ID] = move
	}
	return index
}

// FindMove はIDから技を検索する。
func FindMove(id MoveID) (BattleMove, bool) {
	move, ok := moveByID[id]
	return move, ok
}
