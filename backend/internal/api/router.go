// Package api はGinのルーティングとHTTPハンドラをまとめたもの。
package api

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/TomoyaKubota4375/pachimon/backend/internal/auth"
	"github.com/TomoyaKubota4375/pachimon/backend/internal/models"
	"github.com/TomoyaKubota4375/pachimon/backend/internal/online"
)

// NewRouter はアプリのルーティングを組み立てる。
func NewRouter(pool *pgxpool.Pool, tokens *auth.TokenIssuer, allowedOrigins []string, onlineHub *online.Hub) *gin.Engine {
	users := models.NewUserRepository(pool)
	records := models.NewBattleRecordRepository(pool)

	authH := &authHandlers{users: users, tokens: tokens}
	battleH := &battleHandlers{records: records}
	onlineH := online.NewHandler(onlineHub, tokens)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	apiGroup := r.Group("/api")

	authGroup := apiGroup.Group("/auth")
	authGroup.POST("/signup", authH.signup)
	authGroup.POST("/login", authH.login)

	apiGroup.GET("/me", RequireAuth(tokens), authH.me)

	apiGroup.GET("/monsters", listMonsters)
	apiGroup.GET("/moves", listMoves)

	battlesGroup := apiGroup.Group("/battles")
	battlesGroup.POST("/simulate", OptionalAuth(tokens), battleH.simulateBattle)
	battlesGroup.GET("/records", RequireAuth(tokens), battleH.listMyRecords)

	// オンライン対戦（ルームコードでのマッチング＋WebSocket）。
	// トークンはクエリパラメータ ?token=... で渡す（ブラウザのWebSocket APIの制約のため）。
	r.GET("/ws/battle", onlineH.ServeWS)

	return r
}
