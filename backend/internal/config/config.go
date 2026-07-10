// Package config は環境変数からの設定読み込みをまとめたもの。
package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Config はアプリ起動に必要な設定値。
type Config struct {
	Port           string
	DatabaseURL    string
	JWTSecret      string
	AllowedOrigins []string

	// オンライン対戦の設定
	TurnTimeLimit        time.Duration
	ReconnectGracePeriod time.Duration
}

// Load は .env（あれば）と環境変数から設定を読み込む。
func Load() (Config, error) {
	// .envが無くてもエラーにしない（本番はOS環境変数から渡す想定）
	_ = godotenv.Load()

	cfg := Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
		JWTSecret:   os.Getenv("JWT_SECRET"),
		AllowedOrigins: splitCSV(getEnv(
			"CORS_ALLOWED_ORIGINS",
			// フロントのdevサーバーがよく使うポートをデフォルトで許可しておく
			"http://localhost:3000,http://localhost:3001,http://localhost:3002",
		)),
		TurnTimeLimit:        time.Duration(getEnvSeconds("ONLINE_TURN_TIME_LIMIT_SECONDS", 30)) * time.Second,
		ReconnectGracePeriod: time.Duration(getEnvSeconds("ONLINE_RECONNECT_GRACE_SECONDS", 30)) * time.Second,
	}

	if cfg.DatabaseURL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required")
	}

	if cfg.JWTSecret == "" {
		return Config{}, fmt.Errorf("JWT_SECRET is required")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvSeconds(key string, fallback int64) int64 {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}

	parsed, err := strconv.ParseInt(v, 10, 64)
	if err != nil {
		return fallback
	}

	return parsed
}

func splitCSV(v string) []string {
	parts := strings.Split(v, ",")
	result := make([]string, 0, len(parts))

	for _, p := range parts {
		trimmed := strings.TrimSpace(p)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}

	return result
}
