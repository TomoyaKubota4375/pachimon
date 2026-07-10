package api

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/TomoyaKubota4375/pachimon/backend/internal/auth"
)

const contextUserIDKey = "userID"

// RequireAuth はAuthorization: Bearer <token> を検証し、通ればuserIDをcontextに詰める。
func RequireAuth(tokens *auth.TokenIssuer) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")

		tokenString, ok := strings.CutPrefix(header, "Bearer ")
		if !ok || tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "認証が必要です"})
			return
		}

		userID, err := tokens.ParseToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "トークンが無効です"})
			return
		}

		c.Set(contextUserIDKey, userID)
		c.Next()
	}
}

// OptionalAuth はトークンがあれば検証してcontextに詰めるが、無くても・不正でも通す。
// バトルシミュレーションのように「ログインしていれば記録を残す、していなくても使える」
// エンドポイント向け。
func OptionalAuth(tokens *auth.TokenIssuer) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")

		tokenString, ok := strings.CutPrefix(header, "Bearer ")
		if ok && tokenString != "" {
			if userID, err := tokens.ParseToken(tokenString); err == nil {
				c.Set(contextUserIDKey, userID)
			}
		}

		c.Next()
	}
}

func userIDFromContext(c *gin.Context) (uuid.UUID, bool) {
	v, ok := c.Get(contextUserIDKey)
	if !ok {
		return uuid.Nil, false
	}

	userID, ok := v.(uuid.UUID)
	return userID, ok
}
