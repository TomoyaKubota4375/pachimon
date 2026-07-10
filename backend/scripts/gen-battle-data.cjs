#!/usr/bin/env node
// frontend/features/battle/data/monsters.ts と moves.ts を読み込んで、
// internal/battle/monsters.go と moves.go を自動生成するスクリプト。
//
// 使い方（backendディレクトリで）:
//   node scripts/gen-battle-data.cjs
//
// フロント側のTypeScriptをそのままNodeでimportするのはESMの拡張子解決で
// 面倒なので、object/array リテラル部分だけをテキストとして取り出してevalしている
// （このリポジトリの信頼できる自分のコードに対してだけ使う想定）。

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const MONSTERS_TS = path.join(REPO_ROOT, "frontend/features/battle/data/monsters.ts");
const MOVES_TS = path.join(REPO_ROOT, "frontend/features/battle/data/moves.ts");
const MONSTERS_GO = path.join(__dirname, "..", "internal/battle/monsters.go");
const MOVES_GO = path.join(__dirname, "..", "internal/battle/moves.go");

function extractBalanced(text, startMarker, openChar, closeChar) {
  const startIdx = text.indexOf(startMarker);
  if (startIdx === -1) throw new Error("marker not found: " + startMarker);

  const openIdx = text.indexOf(openChar, startIdx);
  let depth = 0;
  let i = openIdx;

  for (; i < text.length; i++) {
    if (text[i] === openChar) depth++;
    else if (text[i] === closeChar) {
      depth--;
      if (depth === 0) break;
    }
  }

  return text.slice(openIdx, i + 1);
}

const typeConst = {
  blue: "TypeBlue",
  red: "TypeRed",
  green: "TypeGreen",
  yellow: "TypeYellow",
  white: "TypeWhite",
  black: "TypeBlack",
};

const animationConst = {
  "red-attack": "AnimationRedAttack",
  "blue-attack": "AnimationBlueAttack",
  "yellow-attack": "AnimationYellowAttack",
  "white-attack": "AnimationWhiteAttack",
  "black-attack": "AnimationBlackAttack",
  "normal-attack": "AnimationNormalAttack",
  buff: "AnimationBuff",
  debuff: "AnimationDebuff",
  status: "AnimationStatus",
  guard: "AnimationGuard",
};

const targetConst = { self: "TargetSelf", opponent: "TargetOpponent" };

const statConst = {
  attack: "StatAttack",
  defense: "StatDefense",
  speed: "StatSpeed",
  accuracy: "StatAccuracy",
  evasion: "StatEvasion",
};

const statusConst = {
  burn: "StatusBurn",
  paralysis: "StatusParalysis",
  poison: "StatusPoison",
  "bad-poison": "StatusBadPoison",
  freeze: "StatusFreeze",
  sleep: "StatusSleep",
  confusion: "StatusConfusion",
};

function goString(s) {
  return JSON.stringify(s);
}

function genEffect(e) {
  switch (e.type) {
    case "damage":
      return `{Type: EffectDamage, Power: ${e.power}}`;
    case "stat":
      return `{Type: EffectStat, Target: ${targetConst[e.target]}, Stat: ${statConst[e.stat]}, Stages: ${e.stages}, Chance: ${e.chance}}`;
    case "status":
      return `{Type: EffectStatus, Target: ${targetConst[e.target]}, Condition: string(${statusConst[e.condition]}), Chance: ${e.chance}}`;
    case "guard":
      return `{Type: EffectGuard}`;
    default:
      throw new Error("unknown effect type " + e.type);
  }
}

function genMove(m) {
  const effects = m.effects.map(genEffect).join(",\n\t\t\t");
  return `\t{
\t\tID: ${goString(m.id)}, Name: ${goString(m.name)}, Type: ${typeConst[m.type]},
\t\tMaxPP: ${m.maxPp}, Accuracy: ${m.accuracy}, Priority: ${m.priority}, Animation: ${animationConst[m.animation]},
\t\tEffects: []MoveEffect{
\t\t\t${effects},
\t\t},
\t},`;
}

function genMonster(m) {
  const moves = m.moves.map((mv) => goString(mv)).join(", ");
  return `\t{
\t\tID: ${goString(m.id)}, Name: ${goString(m.name)}, Type: ${typeConst[m.type]}, ImagePath: ${goString(m.imagePath)},
\t\tMaxHP: ${m.maxHp}, Attack: ${m.attack}, Defense: ${m.defense}, Speed: ${m.speed},
\t\tMoves: []MoveID{${moves}},
\t},`;
}

function main() {
  const TYPES = { BLUE: "blue", RED: "red", GREEN: "green", YELLOW: "yellow", WHITE: "white", BLACK: "black" };

  const monstersSrc = fs.readFileSync(MONSTERS_TS, "utf8");
  const movesSrc = fs.readFileSync(MOVES_TS, "utf8");

  const monstersObjLiteral = extractBalanced(monstersSrc, "export const monsters = ", "{", "}");
  const movesArrLiteral = extractBalanced(movesSrc, "export const moves = ", "[", "]");

  // eslint-disable-next-line no-eval
  const monsters = eval("(" + monstersObjLiteral + ")");
  // eslint-disable-next-line no-eval
  const moves = eval("(" + movesArrLiteral + ")");

  const movesGo = moves.map(genMove).join("\n");
  const movesFile = `package battle

// Moves はfeatures/battle/data/moves.tsのmovesをそのまま移植したもの。
// フロントのmoves.tsが更新されたら scripts/gen-battle-data.cjs を再実行して同期すること。
// (このファイルは自動生成。手で編集しない)
var Moves = []BattleMove{
${movesGo}
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
`;

  const monstersGo = Object.values(monsters).map(genMonster).join("\n");
  const monstersFile = `package battle

// Monsters はfeatures/battle/data/monsters.tsのmonstersをそのまま移植したもの。
// フロントのmonsters.tsが更新されたら scripts/gen-battle-data.cjs を再実行して同期すること。
// (このファイルは自動生成。手で編集しない)
var Monsters = []MonsterData{
${monstersGo}
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
`;

  fs.writeFileSync(MONSTERS_GO, monstersFile);
  fs.writeFileSync(MOVES_GO, movesFile);

  console.log(`wrote ${MONSTERS_GO} (${Object.keys(monsters).length} monsters)`);
  console.log(`wrote ${MOVES_GO} (${moves.length} moves)`);
  console.log("忘れずに: cd backend && gofmt -w internal/battle && go test ./...");
}

main();
