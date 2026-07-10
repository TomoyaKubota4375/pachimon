-- ユーザー（トレーナー）テーブル。
-- フロントのlib/auth.tsはこれまでlocalStorageに平文パスワードを保存していたが、
-- こちらはbcryptハッシュのみを保存する。
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY,
    trainer_name  TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- バトル結果の記録（今回はオンライン対戦そのものは実装しないが、
-- practiceモード等の結果を残せるようにしておく）。
CREATE TABLE IF NOT EXISTS battle_records (
    id                UUID PRIMARY KEY,
    user_id           UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    player_monster_id TEXT NOT NULL,
    opponent_monster_id TEXT NOT NULL,
    winner            TEXT NOT NULL CHECK (winner IN ('player', 'opponent')),
    turns             INTEGER NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_battle_records_user_id ON battle_records (user_id);
