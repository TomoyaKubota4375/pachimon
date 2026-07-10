# pachimon backend

Go + Gin + PostgreSQL のバックエンド。

- **DB**: ユーザー登録・ログイン（bcryptハッシュ＋JWT）、バトル記録の保存
- **バトルエンジン**: `frontend/features/battle` のロジックをGoに移植（`internal/battle`）
- **オンライン対戦**: ルームコード制のリアルタイム対戦（WebSocket、`internal/online`）

`POST /api/battles/simulate` では、1人プレイ用にバトルをサーバー側で最後まで自動実行することもできる。

## セットアップ

アプリ全体（Postgres + backend + frontend）をDockerだけで起動する場合はリポジトリ直下の
[README](../README.md)を参照。ここではbackendをローカルの`go run`で動かす開発手順を説明する。

```bash
cp .env.example .env
# .env の DATABASE_URL / JWT_SECRET を編集（docker-composeを使うならDATABASE_URLはデフォルトのままでOK）

# Postgresだけdocker-composeで起動
make up
# (= docker compose -f ../docker-compose.yml up -d postgres)

go run ./cmd/server
# (= make run)
```

起動時に `internal/db/migrations/*.sql` が自動実行される（`CREATE TABLE IF NOT EXISTS` ベースのシンプルな仕組み）。

Postgresを止めたい・作り直したい場合：

```bash
make down                          # 停止（データは残る）
docker compose -f ../docker-compose.yml down -v   # データも含めて完全に消す
```

## 動作確認

```bash
make build   # go build ./...
make vet     # go vet ./...
make test    # go test ./...
make fmt     # gofmt -w .
```

`internal/battle` はTypeScript版（`frontend/features/battle`）と1対1で対応させたロジック。
モンスター・技の追加/変更などフロント側の `data/monsters.ts` / `data/moves.ts` を変更したときは、
手で書き写さずに以下でGo側を再生成できる：

```bash
make gen-battle-data
```

`scripts/gen-battle-data.cjs` が `frontend/features/battle/data/monsters.ts` / `moves.ts` を読んで
`internal/battle/monsters.go` / `moves.go` を自動生成する（Node標準機能のみ、追加パッケージ不要）。
ロジック側（`mechanics/` `engine/` 配下など）の変更は自動化していないので、そちらは手動で移植すること。

## API

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| POST | `/api/auth/signup` | - | 新規登録 |
| POST | `/api/auth/login` | - | ログイン |
| GET | `/api/me` | 必須 | 自分の情報 |
| GET | `/api/monsters` | - | モンスター一覧 |
| GET | `/api/moves` | - | 技一覧 |
| POST | `/api/battles/simulate` | 任意（あれば記録を保存） | バトルを最後まで自動実行 |
| GET | `/api/battles/records` | 必須 | 自分のバトル記録一覧 |

### `POST /api/battles/simulate` リクエスト例

```json
{
  "playerMonsterId": "ikarimon",
  "opponentMonsterId": "bonmon",
  "playerMoves": ["ikari-heavy-blow", "ikari-power-up", "ikari-burn"]
}
```

`playerMoves` は使いたい技を順番に並べたもの（配列を使い切ったら先頭に戻って繰り返す）。
相手側はサーバーが毎ターンランダムに選ぶ簡易AI。

## オンライン対戦（WebSocket）

`GET /ws/battle?token=<JWT>` に接続する（ブラウザのWebSocket APIはカスタムヘッダを
付けられないため、認証トークンはクエリパラメータで渡す）。

流れ：

1. 作成側: `{"type":"create_room","monsterId":"...","trainerName":"..."}` を送る
   → `room_created`（部屋コード）→ `waiting_for_opponent` が返る
2. 参加側: `{"type":"join_room","roomCode":"...","monsterId":"...","trainerName":"..."}` を送る
3. 両者揃うと両方に `battle_start`（`you`: 自分がplayer1/player2どちらか、`state`: 初期state、
   `turnDeadline`: 今の選択フェーズの締切=unixミリ秒）が届く
4. 技を選ぶ: `{"type":"select_move","moveId":"..."}` → 両者に `state_update`（最新state・締切）が届く
   制限時間（デフォルト30秒、`ONLINE_TURN_TIME_LIMIT_SECONDS`）内に選ばなければ
   サーバーがランダムに技を選んで自動的にターンを進める
5. 決着がつくと `state.phase === "finished"` になる

バトルの処理そのもの（誰が先に動くか・ダメージ計算・状態異常など）は `internal/battle` が担い、
`internal/online` は「誰と誰をどう繋ぐか」だけを担当している。マッチング成立後は
サーバー権威（クライアントは自分の手番を送るだけで、勝敗判定などは一切しない）。

### 切断・再接続

接続が切れても即座に部屋は破棄しない。

1. 誰かの接続が切れると、相手に `opponent_disconnected` が届く（「再接続を待っています」の意味）
2. 切れた本人は、`{"type":"rejoin_room","roomCode":"..."}` を送って再接続できる
   （猶予時間はデフォルト30秒、`ONLINE_RECONNECT_GRACE_SECONDS`）。成功すると本人に
   `battle_start`（現在のstateとturnDeadline）、相手に `opponent_reconnected` が届く
3. 猶予時間内に再接続がなければ、残っている側に `room_closed` が届いて部屋は破棄される

再接続はJWTのuserIDと部屋コードで本人確認する（同じアカウントでログインし直して
同じ部屋コードを送ればよい。トレーナー名・モンスターIDは元の参加時のものが引き継がれる）。
