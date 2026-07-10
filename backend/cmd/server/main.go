// pachimonのバックエンドサーバー。
// DB(PostgreSQL)によるユーザー管理、バトルエンジンのGo移植、
// ルームコード制のオンライン対戦（WebSocket）を提供する。
package main

import (
	"context"
	"log"

	"github.com/TomoyaKubota4375/pachimon/backend/internal/api"
	"github.com/TomoyaKubota4375/pachimon/backend/internal/auth"
	"github.com/TomoyaKubota4375/pachimon/backend/internal/config"
	"github.com/TomoyaKubota4375/pachimon/backend/internal/db"
	"github.com/TomoyaKubota4375/pachimon/backend/internal/online"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	ctx := context.Background()

	pool, err := db.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db connect: %v", err)
	}
	defer pool.Close()

	if err := db.Migrate(ctx, pool); err != nil {
		log.Fatalf("db migrate: %v", err)
	}

	tokens := auth.NewTokenIssuer(cfg.JWTSecret)
	onlineHub := online.NewHubWithTimers(cfg.TurnTimeLimit, cfg.ReconnectGracePeriod)

	router := api.NewRouter(pool, tokens, cfg.AllowedOrigins, onlineHub)

	log.Printf("listening on :%s", cfg.Port)

	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server: %v", err)
	}
}
