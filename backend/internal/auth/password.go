// Package auth はパスワードのハッシュ化とJWTトークンの発行・検証をまとめたもの。
package auth

import "golang.org/x/crypto/bcrypt"

// HashPassword はパスワードをbcryptでハッシュ化する。
func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

// CheckPassword はパスワードとハッシュが一致するか検証する。
func CheckPassword(password, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}
