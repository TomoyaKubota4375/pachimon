package models

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

// BattleWinner はバトル記録上の勝者（プレイヤー視点）。
type BattleWinner string

const (
	WinnerPlayer   BattleWinner = "player"
	WinnerOpponent BattleWinner = "opponent"
)

// BattleRecord はbattle_recordsテーブルの1行。
type BattleRecord struct {
	ID                uuid.UUID
	UserID            uuid.UUID
	PlayerMonsterID   string
	OpponentMonsterID string
	Winner            BattleWinner
	Turns             int
	CreatedAt         time.Time
}

// BattleRecordRepository はbattle_recordsテーブルへのアクセスをまとめたもの。
type BattleRecordRepository struct {
	pool *pgxpool.Pool
}

// NewBattleRecordRepository はBattleRecordRepositoryを作る。
func NewBattleRecordRepository(pool *pgxpool.Pool) *BattleRecordRepository {
	return &BattleRecordRepository{pool: pool}
}

// Create はバトル結果を1件保存する。
func (r *BattleRecordRepository) Create(ctx context.Context, rec BattleRecord) (BattleRecord, error) {
	rec.ID = uuid.New()

	err := r.pool.QueryRow(ctx,
		`INSERT INTO battle_records
		 	(id, user_id, player_monster_id, opponent_monster_id, winner, turns)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING created_at`,
		rec.ID, rec.UserID, rec.PlayerMonsterID, rec.OpponentMonsterID, rec.Winner, rec.Turns,
	).Scan(&rec.CreatedAt)

	if err != nil {
		return BattleRecord{}, err
	}

	return rec, nil
}

// ListByUser はユーザーの直近のバトル記録を新しい順に返す。
func (r *BattleRecordRepository) ListByUser(ctx context.Context, userID uuid.UUID, limit int) ([]BattleRecord, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, user_id, player_monster_id, opponent_monster_id, winner, turns, created_at
		 FROM battle_records
		 WHERE user_id = $1
		 ORDER BY created_at DESC
		 LIMIT $2`,
		userID, limit,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	records := []BattleRecord{}

	for rows.Next() {
		var rec BattleRecord

		if err := rows.Scan(
			&rec.ID, &rec.UserID, &rec.PlayerMonsterID, &rec.OpponentMonsterID,
			&rec.Winner, &rec.Turns, &rec.CreatedAt,
		); err != nil {
			return nil, err
		}

		records = append(records, rec)
	}

	return records, rows.Err()
}
