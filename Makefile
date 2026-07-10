.PHONY: up down logs build ps

up: ## アプリ全体(Postgres+backend+frontend)をDockerでビルドして起動
	docker compose up -d --build

down: ## 全部停止して削除（データはvolumeに残る）
	docker compose down

logs: ## 全サービスのログを見る
	docker compose logs -f

build: ## イメージだけビルドし直す
	docker compose build

ps: ## 起動中のコンテナ一覧
	docker compose ps
