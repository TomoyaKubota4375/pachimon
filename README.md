# pachimon
nextで初めてポケモンみたいなゲームを作ります。

## Dockerで起動

Postgres・backend（Go）・frontend（Next.js）をまとめて起動できる。

```bash
make up
# (= docker compose up -d --build)
```

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8080

停止する場合：

```bash
make down
```

JWTの署名鍵は環境変数`JWT_SECRET`で上書きできる（未設定時は開発用のデフォルト値を使う）。

```bash
JWT_SECRET=your-long-random-string make up
```

backendをローカルの`go run`で動かしながらPostgresだけDockerで使いたい場合は
[backend/README.md](backend/README.md)を参照。
