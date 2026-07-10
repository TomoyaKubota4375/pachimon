// Package models はDBのテーブルに対応するデータ構造とクエリをまとめたもの。
package models

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// ErrEmailTaken はサインアップ時にメールアドレスが既に使われている場合のエラー。
var ErrEmailTaken = errors.New("models: email already registered")

// ErrUserNotFound はユーザーが見つからない場合のエラー。
var ErrUserNotFound = errors.New("models: user not found")

// User はusersテーブルの1行。
type User struct {
	ID           uuid.UUID
	TrainerName  string
	Email        string
	PasswordHash string
	CreatedAt    time.Time
}

// UserRepository はusersテーブルへのアクセスをまとめたもの。
type UserRepository struct {
	pool *pgxpool.Pool
}

// NewUserRepository はUserRepositoryを作る。
func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

// Create は新しいユーザーを作成する。emailが既に登録済みならErrEmailTakenを返す。
func (r *UserRepository) Create(ctx context.Context, trainerName, email, passwordHash string) (User, error) {
	user := User{
		ID:           uuid.New(),
		TrainerName:  trainerName,
		Email:        email,
		PasswordHash: passwordHash,
	}

	err := r.pool.QueryRow(ctx,
		`INSERT INTO users (id, trainer_name, email, password_hash)
		 VALUES ($1, $2, $3, $4)
		 RETURNING created_at`,
		user.ID, user.TrainerName, user.Email, user.PasswordHash,
	).Scan(&user.CreatedAt)

	if err != nil {
		if isUniqueViolation(err) {
			return User{}, ErrEmailTaken
		}
		return User{}, err
	}

	return user, nil
}

// FindByEmail はメールアドレスからユーザーを検索する。
func (r *UserRepository) FindByEmail(ctx context.Context, email string) (User, error) {
	var user User

	err := r.pool.QueryRow(ctx,
		`SELECT id, trainer_name, email, password_hash, created_at
		 FROM users WHERE email = $1`,
		email,
	).Scan(&user.ID, &user.TrainerName, &user.Email, &user.PasswordHash, &user.CreatedAt)

	if errors.Is(err, pgx.ErrNoRows) {
		return User{}, ErrUserNotFound
	}
	if err != nil {
		return User{}, err
	}

	return user, nil
}

// FindByID はIDからユーザーを検索する。
func (r *UserRepository) FindByID(ctx context.Context, id uuid.UUID) (User, error) {
	var user User

	err := r.pool.QueryRow(ctx,
		`SELECT id, trainer_name, email, password_hash, created_at
		 FROM users WHERE id = $1`,
		id,
	).Scan(&user.ID, &user.TrainerName, &user.Email, &user.PasswordHash, &user.CreatedAt)

	if errors.Is(err, pgx.ErrNoRows) {
		return User{}, ErrUserNotFound
	}
	if err != nil {
		return User{}, err
	}

	return user, nil
}

func isUniqueViolation(err error) bool {
	var pgErr interface{ SQLState() string }
	if errors.As(err, &pgErr) {
		return pgErr.SQLState() == "23505"
	}
	return false
}
