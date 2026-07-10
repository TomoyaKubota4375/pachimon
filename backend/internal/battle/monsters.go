package battle

// Monsters はfeatures/battle/data/monsters.tsのmonstersをそのまま移植したもの。
// フロントのmonsters.tsが更新されたら scripts/gen-battle-data.cjs を再実行して同期すること。
// (このファイルは自動生成。手で編集しない)
var Monsters = []MonsterData{
	{
		ID: "bonmon", Name: "ぼんもん", Type: TypeWhite, ImagePath: "/monsters/bonmon.png",
		MaxHP: 105, Attack: 30, Defense: 22, Speed: 45,
		Moves: []MoveID{"bon-quick-hit", "bon-speed-up", "bon-flash"},
	},
	{
		ID: "kanjimon", Name: "かんじもん", Type: TypeBlue, ImagePath: "/monsters/kanjimon.png",
		MaxHP: 110, Attack: 32, Defense: 24, Speed: 34,
		Moves: []MoveID{"kanji-wave", "kanji-dodge", "kanji-blur"},
	},
	{
		ID: "hiroyamon", Name: "ひろやもん", Type: TypeGreen, ImagePath: "/monsters/hiroyamon.png",
		MaxHP: 135, Attack: 28, Defense: 38, Speed: 20,
		Moves: []MoveID{"hiroya-static", "hiroya-guard-up", "hiroya-paralyze"},
	},
	{
		ID: "sympathymon", Name: "シンパシーもん", Type: TypeBlack, ImagePath: "/monsters/sympathymon.png",
		MaxHP: 115, Attack: 31, Defense: 25, Speed: 30,
		Moves: []MoveID{"sympathy-pressure", "sympathy-slow", "sympathy-dark-hit"},
	},
	{
		ID: "ikarimon", Name: "いかりもん", Type: TypeRed, ImagePath: "/monsters/ikarimon.png",
		MaxHP: 125, Attack: 42, Defense: 24, Speed: 16,
		Moves: []MoveID{"ikari-power-up", "ikari-heavy-blow", "ikari-burn"},
	},
	{
		ID: "shizukumon", Name: "しずくもん", Type: TypeBlue, ImagePath: "/monsters/shizukumon.png",
		MaxHP: 115, Attack: 33, Defense: 26, Speed: 30,
		Moves: []MoveID{"shizuku-splash", "shizuku-focus", "shizuku-mist", "shizuku-guard"},
	},
	{
		ID: "tsunamon", Name: "つなもん", Type: TypeBlue, ImagePath: "/monsters/tsunamon.png",
		MaxHP: 95, Attack: 30, Defense: 18, Speed: 50,
		Moves: []MoveID{"tsuna-rush", "tsuna-accel", "tsuna-splashdown", "tsuna-guard"},
	},
	{
		ID: "korimon", Name: "こおりもん", Type: TypeBlue, ImagePath: "/monsters/korimon.png",
		MaxHP: 145, Attack: 26, Defense: 40, Speed: 15,
		Moves: []MoveID{"kori-blow", "kori-harden", "kori-freeze-breath", "kori-guard"},
	},
	{
		ID: "moemon", Name: "もえもん", Type: TypeRed, ImagePath: "/monsters/moemon.png",
		MaxHP: 115, Attack: 34, Defense: 25, Speed: 28,
		Moves: []MoveID{"moe-flame", "moe-fired-up", "moe-cinder", "moe-guard"},
	},
	{
		ID: "kajimon", Name: "かじもん", Type: TypeRed, ImagePath: "/monsters/kajimon.png",
		MaxHP: 95, Attack: 32, Defense: 17, Speed: 48,
		Moves: []MoveID{"kaji-blaze-dash", "kaji-quickstep", "kaji-spark", "kaji-guard"},
	},
	{
		ID: "yakemon", Name: "やけもん", Type: TypeRed, ImagePath: "/monsters/yakemon.png",
		MaxHP: 150, Attack: 27, Defense: 42, Speed: 14,
		Moves: []MoveID{"yake-smolder", "yake-toughen", "yake-scorch", "yake-guard"},
	},
	{
		ID: "midorimon", Name: "れもん", Type: TypeGreen, ImagePath: "/monsters/midorimon.png",
		MaxHP: 118, Attack: 32, Defense: 28, Speed: 27,
		Moves: []MoveID{"midori-whip", "midori-growth", "midori-thorns", "midori-guard"},
	},
	{
		ID: "tsurumon", Name: "つるもん", Type: TypeGreen, ImagePath: "/monsters/tsurumon.png",
		MaxHP: 96, Attack: 31, Defense: 18, Speed: 49,
		Moves: []MoveID{"tsuru-strike", "tsuru-vine-dash", "tsuru-bind", "tsuru-guard"},
	},
	{
		ID: "mokumon", Name: "もくもん", Type: TypeGreen, ImagePath: "/monsters/mokumon.png",
		MaxHP: 148, Attack: 26, Defense: 41, Speed: 15,
		Moves: []MoveID{"moku-slam", "moku-bark-up", "moku-spore", "moku-guard"},
	},
	{
		ID: "hikarimon", Name: "ひかりもん", Type: TypeWhite, ImagePath: "/monsters/hikarimon.png",
		MaxHP: 116, Attack: 33, Defense: 27, Speed: 29,
		Moves: []MoveID{"hikari-beam", "hikari-focus", "hikari-glare", "hikari-guard"},
	},
	{
		ID: "kirakiramon", Name: "きらきらもん", Type: TypeWhite, ImagePath: "/monsters/kirakiramon.png",
		MaxHP: 94, Attack: 31, Defense: 17, Speed: 51,
		Moves: []MoveID{"kira-flash-dash", "kira-shine", "kira-dazzle", "kira-guard"},
	},
	{
		ID: "yukimon", Name: "らしょうもん", Type: TypeWhite, ImagePath: "/monsters/yukimon.png",
		MaxHP: 147, Attack: 26, Defense: 41, Speed: 14,
		Moves: []MoveID{"yuki-blow", "yuki-harden", "yuki-chill", "yuki-guard"},
	},
	{
		ID: "yamimon", Name: "べあもん", Type: TypeBlack, ImagePath: "/monsters/yamimon.png",
		MaxHP: 117, Attack: 34, Defense: 26, Speed: 28,
		Moves: []MoveID{"yami-strike", "yami-focus", "yami-curse", "yami-guard"},
	},
	{
		ID: "kagemon", Name: "しもん", Type: TypeBlack, ImagePath: "/monsters/kagemon.png",
		MaxHP: 95, Attack: 32, Defense: 17, Speed: 50,
		Moves: []MoveID{"kage-dash", "kage-slip", "kage-drain", "kage-guard"},
	},
	{
		ID: "jamon", Name: "強欲の悪魔  マモン", Type: TypeBlack, ImagePath: "/monsters/jamon.png",
		MaxHP: 170, Attack: 27, Defense: 42, Speed: 13,
		Moves: []MoveID{"ja-crush", "ja-harden", "ja-poison-fang", "ja-guard"},
	},
	{
		ID: "awamon", Name: "アワもん", Type: TypeBlue, ImagePath: "/monsters/awamon.png",
		MaxHP: 118, Attack: 32, Defense: 27, Speed: 28,
		Moves: []MoveID{"mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"},
	},
	{
		ID: "takimon", Name: "タキもん", Type: TypeBlue, ImagePath: "/monsters/takimon.png",
		MaxHP: 92, Attack: 30, Defense: 17, Speed: 50,
		Moves: []MoveID{"mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"},
	},
	{
		ID: "sangomon", Name: "サンゴもん", Type: TypeBlue, ImagePath: "/monsters/sangomon.png",
		MaxHP: 148, Attack: 25, Defense: 41, Speed: 15,
		Moves: []MoveID{"mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"},
	},
	{
		ID: "kujiramon", Name: "クジラもん", Type: TypeBlue, ImagePath: "/monsters/kujiramon.png",
		MaxHP: 105, Attack: 41, Defense: 22, Speed: 32,
		Moves: []MoveID{"mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"},
	},
	{
		ID: "takomon", Name: "タコもん", Type: TypeBlue, ImagePath: "/monsters/takomon.png",
		MaxHP: 128, Attack: 28, Defense: 35, Speed: 22,
		Moves: []MoveID{"mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"},
	},
	{
		ID: "kaimon", Name: "カイもん", Type: TypeBlue, ImagePath: "/monsters/kaimon.png",
		MaxHP: 121, Attack: 33, Defense: 26, Speed: 29,
		Moves: []MoveID{"mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"},
	},
	{
		ID: "mizutamamon", Name: "ミズタマもん", Type: TypeBlue, ImagePath: "/monsters/mizutamamon.png",
		MaxHP: 95, Attack: 29, Defense: 18, Speed: 52,
		Moves: []MoveID{"mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"},
	},
	{
		ID: "samemon", Name: "サメもん", Type: TypeBlue, ImagePath: "/monsters/samemon.png",
		MaxHP: 151, Attack: 26, Defense: 40, Speed: 14,
		Moves: []MoveID{"mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"},
	},
	{
		ID: "izumimon", Name: "イズミもん", Type: TypeBlue, ImagePath: "/monsters/izumimon.png",
		MaxHP: 108, Attack: 40, Defense: 23, Speed: 31,
		Moves: []MoveID{"mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"},
	},
	{
		ID: "uzumon", Name: "ウズもん", Type: TypeBlue, ImagePath: "/monsters/uzumon.png",
		MaxHP: 125, Attack: 27, Defense: 36, Speed: 23,
		Moves: []MoveID{"mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"},
	},
	{
		ID: "shiomon", Name: "シオもん", Type: TypeBlue, ImagePath: "/monsters/shiomon.png",
		MaxHP: 116, Attack: 34, Defense: 25, Speed: 30,
		Moves: []MoveID{"mizu-tackle", "mizu-guard-up", "mizu-chill", "mizu-guard"},
	},
	{
		ID: "takibimon", Name: "タキビもん", Type: TypeRed, ImagePath: "/monsters/takibimon.png",
		MaxHP: 119, Attack: 33, Defense: 26, Speed: 27,
		Moves: []MoveID{"honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"},
	},
	{
		ID: "hibanamon", Name: "ヒバナもん", Type: TypeRed, ImagePath: "/monsters/hibanamon.png",
		MaxHP: 90, Attack: 31, Defense: 16, Speed: 51,
		Moves: []MoveID{"honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"},
	},
	{
		ID: "entotsumon", Name: "エントツもん", Type: TypeRed, ImagePath: "/monsters/entotsumon.png",
		MaxHP: 150, Attack: 24, Defense: 42, Speed: 13,
		Moves: []MoveID{"honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"},
	},
	{
		ID: "yoganmon", Name: "ヨウガンもん", Type: TypeRed, ImagePath: "/monsters/yoganmon.png",
		MaxHP: 103, Attack: 42, Defense: 21, Speed: 33,
		Moves: []MoveID{"honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"},
	},
	{
		ID: "taimatsumon", Name: "タイマツもん", Type: TypeRed, ImagePath: "/monsters/taimatsumon.png",
		MaxHP: 126, Attack: 29, Defense: 34, Speed: 21,
		Moves: []MoveID{"honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"},
	},
	{
		ID: "konromon", Name: "コンロもん", Type: TypeRed, ImagePath: "/monsters/konromon.png",
		MaxHP: 117, Attack: 32, Defense: 28, Speed: 28,
		Moves: []MoveID{"honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"},
	},
	{
		ID: "sumibimon", Name: "スミビもん", Type: TypeRed, ImagePath: "/monsters/sumibimon.png",
		MaxHP: 93, Attack: 30, Defense: 17, Speed: 49,
		Moves: []MoveID{"honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"},
	},
	{
		ID: "kazanmon", Name: "カザンもん", Type: TypeRed, ImagePath: "/monsters/kazanmon.png",
		MaxHP: 153, Attack: 25, Defense: 43, Speed: 12,
		Moves: []MoveID{"honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"},
	},
	{
		ID: "hinokomon", Name: "ヒノコもん", Type: TypeRed, ImagePath: "/monsters/hinokomon.png",
		MaxHP: 106, Attack: 43, Defense: 20, Speed: 34,
		Moves: []MoveID{"honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"},
	},
	{
		ID: "danromon", Name: "ダンロもん", Type: TypeRed, ImagePath: "/monsters/danromon.png",
		MaxHP: 124, Attack: 28, Defense: 35, Speed: 20,
		Moves: []MoveID{"honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"},
	},
	{
		ID: "noroshimon", Name: "ノロシもん", Type: TypeRed, ImagePath: "/monsters/noroshimon.png",
		MaxHP: 120, Attack: 34, Defense: 27, Speed: 29,
		Moves: []MoveID{"honoo-tackle", "honoo-fired-up", "honoo-ember", "honoo-guard"},
	},
	{
		ID: "happamon", Name: "ハッパもん", Type: TypeGreen, ImagePath: "/monsters/happamon.png",
		MaxHP: 122, Attack: 31, Defense: 29, Speed: 26,
		Moves: []MoveID{"kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"},
	},
	{
		ID: "tsubomimon", Name: "ツボミもん", Type: TypeGreen, ImagePath: "/monsters/tsubomimon.png",
		MaxHP: 88, Attack: 29, Defense: 19, Speed: 48,
		Moves: []MoveID{"kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"},
	},
	{
		ID: "kinokomon", Name: "キノコもん", Type: TypeGreen, ImagePath: "/monsters/kinokomon.png",
		MaxHP: 146, Attack: 24, Defense: 40, Speed: 16,
		Moves: []MoveID{"kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"},
	},
	{
		ID: "tsutamon", Name: "ツタもん", Type: TypeGreen, ImagePath: "/monsters/tsutamon.png",
		MaxHP: 104, Attack: 39, Defense: 22, Speed: 30,
		Moves: []MoveID{"kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"},
	},
	{
		ID: "tanemon", Name: "タネもん", Type: TypeGreen, ImagePath: "/monsters/tanemon.png",
		MaxHP: 130, Attack: 27, Defense: 36, Speed: 21,
		Moves: []MoveID{"kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"},
	},
	{
		ID: "shibamon", Name: "シバもん", Type: TypeGreen, ImagePath: "/monsters/shibamon.png",
		MaxHP: 119, Attack: 32, Defense: 28, Speed: 27,
		Moves: []MoveID{"kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"},
	},
	{
		ID: "hanamon", Name: "ハナもん", Type: TypeGreen, ImagePath: "/monsters/hanamon.png",
		MaxHP: 91, Attack: 30, Defense: 18, Speed: 47,
		Moves: []MoveID{"kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"},
	},
	{
		ID: "morimon", Name: "モリもん", Type: TypeGreen, ImagePath: "/monsters/morimon.png",
		MaxHP: 149, Attack: 25, Defense: 41, Speed: 15,
		Moves: []MoveID{"kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"},
	},
	{
		ID: "kokemon", Name: "コケもん", Type: TypeGreen, ImagePath: "/monsters/kokemon.png",
		MaxHP: 107, Attack: 40, Defense: 21, Speed: 31,
		Moves: []MoveID{"kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"},
	},
	{
		ID: "nekkomon", Name: "ネッコもん", Type: TypeGreen, ImagePath: "/monsters/nekkomon.png",
		MaxHP: 127, Attack: 28, Defense: 37, Speed: 20,
		Moves: []MoveID{"kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"},
	},
	{
		ID: "waramon", Name: "ワラもん", Type: TypeGreen, ImagePath: "/monsters/waramon.png",
		MaxHP: 115, Attack: 31, Defense: 27, Speed: 28,
		Moves: []MoveID{"kusa-tackle", "kusa-growth", "kusa-vine-whip", "kusa-guard"},
	},
	{
		ID: "tsukimon", Name: "ツキもん", Type: TypeWhite, ImagePath: "/monsters/tsukimon.png",
		MaxHP: 117, Attack: 33, Defense: 27, Speed: 29,
		Moves: []MoveID{"haku-tackle", "haku-focus", "haku-glare", "haku-guard"},
	},
	{
		ID: "kumomon", Name: "クモもん", Type: TypeWhite, ImagePath: "/monsters/kumomon.png",
		MaxHP: 89, Attack: 30, Defense: 17, Speed: 50,
		Moves: []MoveID{"haku-tackle", "haku-focus", "haku-glare", "haku-guard"},
	},
	{
		ID: "shiromon", Name: "シロもん", Type: TypeWhite, ImagePath: "/monsters/shiromon.png",
		MaxHP: 147, Attack: 25, Defense: 41, Speed: 14,
		Moves: []MoveID{"haku-tackle", "haku-focus", "haku-glare", "haku-guard"},
	},
	{
		ID: "hanemon", Name: "ハネもん", Type: TypeWhite, ImagePath: "/monsters/hanemon.png",
		MaxHP: 102, Attack: 41, Defense: 21, Speed: 35,
		Moves: []MoveID{"haku-tackle", "haku-focus", "haku-glare", "haku-guard"},
	},
	{
		ID: "mashiromon", Name: "マシロもん", Type: TypeWhite, ImagePath: "/monsters/mashiromon.png",
		MaxHP: 129, Attack: 27, Defense: 35, Speed: 22,
		Moves: []MoveID{"haku-tackle", "haku-focus", "haku-glare", "haku-guard"},
	},
	{
		ID: "shinjumon", Name: "シンジュもん", Type: TypeWhite, ImagePath: "/monsters/shinjumon.png",
		MaxHP: 118, Attack: 32, Defense: 28, Speed: 28,
		Moves: []MoveID{"haku-tackle", "haku-focus", "haku-glare", "haku-guard"},
	},
	{
		ID: "yureimon", Name: "ユウレイもん", Type: TypeWhite, ImagePath: "/monsters/yureimon.png",
		MaxHP: 94, Attack: 31, Defense: 16, Speed: 53,
		Moves: []MoveID{"haku-tackle", "haku-focus", "haku-glare", "haku-guard"},
	},
	{
		ID: "tenshimon", Name: "テンシもん", Type: TypeWhite, ImagePath: "/monsters/tenshimon.png",
		MaxHP: 144, Attack: 26, Defense: 39, Speed: 17,
		Moves: []MoveID{"haku-tackle", "haku-focus", "haku-glare", "haku-guard"},
	},
	{
		ID: "garasumon", Name: "ガラスもん", Type: TypeWhite, ImagePath: "/monsters/garasumon.png",
		MaxHP: 99, Attack: 40, Defense: 18, Speed: 36,
		Moves: []MoveID{"haku-tackle", "haku-focus", "haku-glare", "haku-guard"},
	},
	{
		ID: "kirimon", Name: "キリもん", Type: TypeWhite, ImagePath: "/monsters/kirimon.png",
		MaxHP: 126, Attack: 28, Defense: 34, Speed: 23,
		Moves: []MoveID{"haku-tackle", "haku-focus", "haku-glare", "haku-guard"},
	},
	{
		ID: "shirokumamon", Name: "ほっきょくべあもん", Type: TypeWhite, ImagePath: "/monsters/shirokumamon.png",
		MaxHP: 155, Attack: 27, Defense: 44, Speed: 12,
		Moves: []MoveID{"haku-tackle", "haku-focus", "haku-glare", "haku-guard"},
	},
	{
		ID: "karasumon", Name: "カラスもん", Type: TypeBlack, ImagePath: "/monsters/karasumon.png",
		MaxHP: 116, Attack: 32, Defense: 26, Speed: 30,
		Moves: []MoveID{"koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "komorimon", Name: "でーもん", Type: TypeBlack, ImagePath: "/monsters/komorimon.png",
		MaxHP: 87, Attack: 29, Defense: 16, Speed: 54,
		Moves: []MoveID{"koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "sumimon", Name: "スミもん", Type: TypeBlack, ImagePath: "/monsters/sumimon.png",
		MaxHP: 150, Attack: 24, Defense: 42, Speed: 13,
		Moves: []MoveID{"koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "yakoumon", Name: "ヤコウもん", Type: TypeBlack, ImagePath: "/monsters/yakoumon.png",
		MaxHP: 101, Attack: 41, Defense: 20, Speed: 34,
		Moves: []MoveID{"koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "noroimon", Name: "ノロイもん", Type: TypeBlack, ImagePath: "/monsters/noroimon.png",
		MaxHP: 124, Attack: 28, Defense: 35, Speed: 22,
		Moves: []MoveID{"koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "akumamon", Name: "アクマもん", Type: TypeBlack, ImagePath: "/monsters/akumamon.png",
		MaxHP: 121, Attack: 34, Defense: 27, Speed: 27,
		Moves: []MoveID{"koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "kuronekomon", Name: "クロネコもん", Type: TypeBlack, ImagePath: "/monsters/kuronekomon.png",
		MaxHP: 92, Attack: 30, Defense: 18, Speed: 49,
		Moves: []MoveID{"koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "masukumon", Name: "マスクもん", Type: TypeBlack, ImagePath: "/monsters/masukumon.png",
		MaxHP: 148, Attack: 25, Defense: 40, Speed: 15,
		Moves: []MoveID{"koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "mekakushimon", Name: "メカクシもん", Type: TypeBlack, ImagePath: "/monsters/mekakushimon.png",
		MaxHP: 105, Attack: 39, Defense: 21, Speed: 32,
		Moves: []MoveID{"koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "tasogaremon", Name: "タソガレもん", Type: TypeBlack, ImagePath: "/monsters/tasogaremon.png",
		MaxHP: 123, Attack: 27, Defense: 36, Speed: 21,
		Moves: []MoveID{"koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "shikkokumon", Name: "シッコクもん", Type: TypeBlack, ImagePath: "/monsters/shikkokumon.png",
		MaxHP: 119, Attack: 33, Defense: 28, Speed: 26,
		Moves: []MoveID{"koku-tackle", "koku-focus", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "inazumamon", Name: "イナズマもん", Type: TypeYellow, ImagePath: "/monsters/inazumamon.png",
		MaxHP: 112, Attack: 34, Defense: 25, Speed: 35,
		Moves: []MoveID{"denki-tackle", "denki-charge", "denki-shock", "denki-guard"},
	},
	{
		ID: "denchimon", Name: "デンチもん", Type: TypeYellow, ImagePath: "/monsters/denchimon.png",
		MaxHP: 90, Attack: 29, Defense: 17, Speed: 52,
		Moves: []MoveID{"denki-tackle", "denki-charge", "denki-shock", "denki-guard"},
	},
	{
		ID: "raimon", Name: "ライもん", Type: TypeYellow, ImagePath: "/monsters/raimon.png",
		MaxHP: 142, Attack: 26, Defense: 39, Speed: 18,
		Moves: []MoveID{"denki-tackle", "denki-charge", "denki-shock", "denki-guard"},
	},
	{
		ID: "suzumon", Name: "スズもん", Type: TypeYellow, ImagePath: "/monsters/suzumon.png",
		MaxHP: 100, Attack: 40, Defense: 20, Speed: 37,
		Moves: []MoveID{"denki-tackle", "denki-charge", "denki-shock", "denki-guard"},
	},
	{
		ID: "koudenmon", Name: "コウデンもん", Type: TypeYellow, ImagePath: "/monsters/koudenmon.png",
		MaxHP: 122, Attack: 28, Defense: 33, Speed: 25,
		Moves: []MoveID{"denki-tackle", "denki-charge", "denki-shock", "denki-guard"},
	},
	{
		ID: "biribirimon", Name: "ビリビリもん", Type: TypeYellow, ImagePath: "/monsters/biribirimon.png",
		MaxHP: 114, Attack: 33, Defense: 26, Speed: 34,
		Moves: []MoveID{"denki-tackle", "denki-charge", "denki-shock", "denki-guard"},
	},
	{
		ID: "hatsudenmon", Name: "ハツデンもん", Type: TypeYellow, ImagePath: "/monsters/hatsudenmon.png",
		MaxHP: 93, Attack: 30, Defense: 18, Speed: 50,
		Moves: []MoveID{"denki-tackle", "denki-charge", "denki-shock", "denki-guard"},
	},
	{
		ID: "jishakumon", Name: "ジシャクもん", Type: TypeYellow, ImagePath: "/monsters/jishakumon.png",
		MaxHP: 145, Attack: 25, Defense: 40, Speed: 17,
		Moves: []MoveID{"denki-tackle", "denki-charge", "denki-shock", "denki-guard"},
	},
	{
		ID: "kaminarimon", Name: "カミナリもん", Type: TypeYellow, ImagePath: "/monsters/kaminarimon.png",
		MaxHP: 103, Attack: 41, Defense: 19, Speed: 38,
		Moves: []MoveID{"denki-tackle", "denki-charge", "denki-shock", "denki-guard"},
	},
	{
		ID: "konsentomon", Name: "コンセントもん", Type: TypeYellow, ImagePath: "/monsters/konsentomon.png",
		MaxHP: 120, Attack: 27, Defense: 34, Speed: 24,
		Moves: []MoveID{"denki-tackle", "denki-charge", "denki-shock", "denki-guard"},
	},
	{
		ID: "renjimon", Name: "デンシレンジもん", Type: TypeRed, ImagePath: "/monsters/renjimon.png",
		MaxHP: 180, Attack: 70, Defense: 25, Speed: 40,
		Moves: []MoveID{"renji-nuke", "renji-overheat", "honoo-ember", "honoo-guard"},
	},
	{
		ID: "wifimon", Name: "Wi-Fiもん", Type: TypeYellow, ImagePath: "/monsters/wifimon.png",
		MaxHP: 150, Attack: 55, Defense: 20, Speed: 99,
		Moves: []MoveID{"wifi-lag-spike", "wifi-full-bars", "denki-charge", "denki-guard"},
	},
	{
		ID: "shimekirimon", Name: "シメキリもん", Type: TypeBlack, ImagePath: "/monsters/shimekirimon.png",
		MaxHP: 160, Attack: 75, Defense: 18, Speed: 60,
		Moves: []MoveID{"shimekiri-panic", "shimekiri-overtime", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "energymon", Name: "エナジーもん", Type: TypeRed, ImagePath: "/monsters/energymon.png",
		MaxHP: 140, Attack: 65, Defense: 15, Speed: 90,
		Moves: []MoveID{"energy-burst", "energy-overdrive", "honoo-tackle", "honoo-guard"},
	},
	{
		ID: "printermon", Name: "プリンターもん", Type: TypeWhite, ImagePath: "/monsters/printermon.png",
		MaxHP: 130, Attack: 80, Defense: 20, Speed: 35,
		Moves: []MoveID{"printer-jam-slam", "printer-double-sided", "haku-focus", "haku-guard"},
	},
	{
		ID: "jukenmon", Name: "ジュケンもん", Type: TypeBlack, ImagePath: "/monsters/jukenmon.png",
		MaxHP: 120, Attack: 72, Defense: 15, Speed: 25,
		Moves: []MoveID{"juken-desperation", "juken-cram", "koku-shadow-bite", "koku-guard"},
	},
	{
		ID: "overclockmon", Name: "オーバークロックもん", Type: TypeYellow, ImagePath: "/monsters/overclockmon.png",
		MaxHP: 110, Attack: 68, Defense: 12, Speed: 95,
		Moves: []MoveID{"overclock-surge", "overclock-boost", "denki-shock", "denki-guard"},
	},
	{
		ID: "zangyoumon", Name: "ザンギョウもん", Type: TypeBlack, ImagePath: "/monsters/zangyoumon.png",
		MaxHP: 200, Attack: 60, Defense: 45, Speed: 45,
		Moves: []MoveID{"zangyou-breakdown", "zangyou-endure", "koku-tackle", "koku-guard"},
	},
	{
		ID: "shuenmon", Name: "終焉のパチモン", Type: TypeBlack, ImagePath: "/monsters/shuenmon.png",
		MaxHP: 420, Attack: 58, Defense: 55, Speed: 38,
		Moves: []MoveID{"shuen-collapse", "shuen-despair", "shuen-eclipse", "koku-guard"},
	},
	{
		ID: "ryumon", Name: "いにしえのりゅうもん", Type: TypeBlue, ImagePath: "/monsters/ryumon.png",
		MaxHP: 380, Attack: 60, Defense: 50, Speed: 30,
		Moves: []MoveID{"ryu-tidal-crush", "ryu-ancient-roar", "ryu-abyss-breath", "mizu-guard"},
	},
	{
		ID: "gokurakuchoumon", Name: "ごくらくちょうもん", Type: TypeWhite, ImagePath: "/monsters/gokurakuchoumon.png",
		MaxHP: 300, Attack: 55, Defense: 35, Speed: 65,
		Moves: []MoveID{"goku-radiant-dive", "goku-wing-gale", "goku-holy-light", "haku-guard"},
	},
	{
		ID: "daichiohmon", Name: "だいちのおうもん", Type: TypeGreen, ImagePath: "/monsters/daichiohmon.png",
		MaxHP: 450, Attack: 48, Defense: 68, Speed: 18,
		Moves: []MoveID{"daichi-quake", "daichi-bulwark", "daichi-root-prison", "kusa-guard"},
	},
	{
		ID: "kenjamon", Name: "ほのおのけんじゃもん", Type: TypeRed, ImagePath: "/monsters/kenjamon.png",
		MaxHP: 340, Attack: 62, Defense: 40, Speed: 35,
		Moves: []MoveID{"kenja-inferno", "kenja-flame-mastery", "kenja-cinderstorm", "honoo-guard"},
	},
	{
		ID: "raijinmon", Name: "らいじんもん", Type: TypeYellow, ImagePath: "/monsters/raijinmon.png",
		MaxHP: 320, Attack: 58, Defense: 38, Speed: 58,
		Moves: []MoveID{"raijin-thunderstrike", "raijin-overcharge", "raijin-static-field", "denki-guard"},
	},
	{
		ID: "yamijoomon", Name: "やみのじょおうもん", Type: TypeBlack, ImagePath: "/monsters/yamijoomon.png",
		MaxHP: 360, Attack: 56, Defense: 45, Speed: 42,
		Moves: []MoveID{"joo-void-strike", "joo-dark-crown", "joo-abyssal-curse", "koku-guard"},
	},
}

var monsterByID = buildMonsterIndex()

func buildMonsterIndex() map[string]MonsterData {
	index := make(map[string]MonsterData, len(Monsters))
	for _, monster := range Monsters {
		index[monster.ID] = monster
	}
	return index
}

// FindMonster はIDからモンスター種族データを検索する。
func FindMonster(id string) (MonsterData, bool) {
	monster, ok := monsterByID[id]
	return monster, ok
}
