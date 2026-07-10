package api

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/TomoyaKubota4375/pachimon/backend/internal/auth"
	"github.com/TomoyaKubota4375/pachimon/backend/internal/models"
)

type authHandlers struct {
	users  *models.UserRepository
	tokens *auth.TokenIssuer
}

type signupRequest struct {
	TrainerName string `json:"trainerName"`
	Email       string `json:"email"`
	Password    string `json:"password"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type authResponse struct {
	Token string      `json:"token"`
	User  userSummary `json:"user"`
}

type userSummary struct {
	ID          string `json:"id"`
	TrainerName string `json:"trainerName"`
	Email       string `json:"email"`
}

// signup はフロントのlib/auth.tsのsignup()バリデーションをサーバー側でも踏襲している。
func (h *authHandlers) signup(c *gin.Context) {
	var req signupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "リクエストの形式が正しくありません"})
		return
	}

	trainerName := strings.TrimSpace(req.TrainerName)
	email := strings.TrimSpace(req.Email)

	if trainerName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "トレーナー名を入力してください"})
		return
	}

	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "メールアドレスを入力してください"})
		return
	}

	if !strings.Contains(email, "@") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "メールアドレスが正しくありません"})
		return
	}

	if len(req.Password) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "パスワードは6文字以上です"})
		return
	}

	passwordHash, err := auth.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "サーバーエラーが発生しました"})
		return
	}

	user, err := h.users.Create(c.Request.Context(), trainerName, email, passwordHash)
	if errors.Is(err, models.ErrEmailTaken) {
		c.JSON(http.StatusConflict, gin.H{"error": "このメールアドレスは登録済みです"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "サーバーエラーが発生しました"})
		return
	}

	token, err := h.tokens.IssueToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "サーバーエラーが発生しました"})
		return
	}

	c.JSON(http.StatusCreated, authResponse{
		Token: token,
		User:  toUserSummary(user),
	})
}

func (h *authHandlers) login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "リクエストの形式が正しくありません"})
		return
	}

	email := strings.TrimSpace(req.Email)

	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "メールアドレスを入力してください"})
		return
	}

	if req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "パスワードを入力してください"})
		return
	}

	user, err := h.users.FindByEmail(c.Request.Context(), email)
	if errors.Is(err, models.ErrUserNotFound) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "メールアドレスまたはパスワードが違います"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "サーバーエラーが発生しました"})
		return
	}

	if !auth.CheckPassword(req.Password, user.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "メールアドレスまたはパスワードが違います"})
		return
	}

	token, err := h.tokens.IssueToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "サーバーエラーが発生しました"})
		return
	}

	c.JSON(http.StatusOK, authResponse{
		Token: token,
		User:  toUserSummary(user),
	})
}

func (h *authHandlers) me(c *gin.Context) {
	userID, ok := userIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "認証が必要です"})
		return
	}

	user, err := h.users.FindByID(c.Request.Context(), userID)
	if errors.Is(err, models.ErrUserNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "ユーザーが見つかりません"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "サーバーエラーが発生しました"})
		return
	}

	c.JSON(http.StatusOK, toUserSummary(user))
}

func toUserSummary(user models.User) userSummary {
	return userSummary{
		ID:          user.ID.String(),
		TrainerName: user.TrainerName,
		Email:       user.Email,
	}
}
