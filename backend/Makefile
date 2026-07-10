.PHONY: up down logs run build test vet fmt tidy gen-battle-data

up: ## docker-composeでPostgresだけ起動（ローカルでgo runする開発用）
	docker compose -f ../docker-compose.yml up -d postgres

down: ## Postgresを停止（データは残る）
	docker compose -f ../docker-compose.yml stop postgres

logs: ## Postgresのログを見る
	docker compose -f ../docker-compose.yml logs -f postgres

run: ## サーバーを起動（.envを読む）
	go run ./cmd/server

build: ## バイナリをビルド
	go build -o bin/server ./cmd/server

test: ## テスト実行
	go test ./...

vet: ## go vet
	go vet ./...

fmt: ## gofmtでフォーマット
	gofmt -w .

tidy: ## go.mod/go.sumを整理
	go mod tidy

gen-battle-data: ## frontend/features/battle/data/*.ts からGo側のモンスター・技データを再生成
	node scripts/gen-battle-data.cjs
	gofmt -w internal/battle
	go test ./internal/battle/...
