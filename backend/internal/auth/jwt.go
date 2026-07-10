package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// ErrInvalidToken はトークンが不正・期限切れの場合のエラー。
var ErrInvalidToken = errors.New("auth: invalid token")

const tokenTTL = 7 * 24 * time.Hour

type claims struct {
	UserID string `json:"sub"`
	jwt.RegisteredClaims
}

// TokenIssuer はJWTの発行・検証を行う。
type TokenIssuer struct {
	secret []byte
}

// NewTokenIssuer はsecretを使うTokenIssuerを作る。
func NewTokenIssuer(secret string) *TokenIssuer {
	return &TokenIssuer{secret: []byte(secret)}
}

// IssueToken はuserIDを含む署名済みJWTを発行する。
func (t *TokenIssuer) IssueToken(userID uuid.UUID) (string, error) {
	now := time.Now()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims{
		UserID: userID.String(),
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(tokenTTL)),
		},
	})

	return token.SignedString(t.secret)
}

// ParseToken はJWTを検証してuserIDを取り出す。
func (t *TokenIssuer) ParseToken(tokenString string) (uuid.UUID, error) {
	parsed, err := jwt.ParseWithClaims(tokenString, &claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrInvalidToken
		}
		return t.secret, nil
	})

	if err != nil || !parsed.Valid {
		return uuid.Nil, ErrInvalidToken
	}

	claims, ok := parsed.Claims.(*claims)
	if !ok {
		return uuid.Nil, ErrInvalidToken
	}

	userID, err := uuid.Parse(claims.UserID)
	if err != nil {
		return uuid.Nil, ErrInvalidToken
	}

	return userID, nil
}
