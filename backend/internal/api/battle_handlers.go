package api

import (
	"math/rand"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/TomoyaKubota4375/pachimon/backend/internal/battle"
	"github.com/TomoyaKubota4375/pachimon/backend/internal/models"
)

type battleHandlers struct {
	records *models.BattleRecordRepository
}

type simulateBattleRequest struct {
	PlayerMonsterID   string          `json:"playerMonsterId"`
	OpponentMonsterID string          `json:"opponentMonsterId"`
	PlayerMoves       []battle.MoveID `json:"playerMoves"`
}

type simulateBattleResponse struct {
	Winner     string             `json:"winner"` // "player" | "opponent"
	Turns      int                `json:"turns"`
	Logs       []string           `json:"logs"`
	FinalState battle.BattleState `json:"finalState"`
}

const maxSimulatedTurns = 200

// pickOpponentMove は相手側（サーバー側AI）の技をランダムに選ぶ。
// オンライン対戦（人間同士のリアルタイム対戦）は今回のスコープ外なので、
// 「1人用のシミュレーション」としてこの場しのぎのAIで賄っている。
func pickOpponentMove(state battle.BattleState) (battle.MoveID, bool) {
	available := make([]battle.MoveID, 0, len(state.Player2.Monster.Moves))

	for _, moveID := range state.Player2.Monster.Moves {
		if battle.CanUseMove(state, battle.Player2, moveID) {
			available = append(available, moveID)
		}
	}

	if len(available) == 0 {
		return "", false
	}

	return available[rand.Intn(len(available))], true
}

// simulateBattle はfeatures/battleのバトルエンジンを1人用シミュレーションとして
// 実行するエンドポイント。認証済みならbattle_recordsに結果を保存する。
func (h *battleHandlers) simulateBattle(c *gin.Context) {
	var req simulateBattleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "リクエストの形式が正しくありません"})
		return
	}

	if len(req.PlayerMoves) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "playerMovesを1つ以上指定してください"})
		return
	}

	state, ok := battle.NewBattleState(req.PlayerMonsterID, req.OpponentMonsterID)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "モンスターIDが不正です"})
		return
	}

	playerMoveIndex := 0

	for turn := 0; turn < maxSimulatedTurns && state.Phase != battle.PhaseFinished; turn++ {
		playerMoveID := req.PlayerMoves[playerMoveIndex%len(req.PlayerMoves)]
		playerMoveIndex++

		if !battle.CanUseMove(state, battle.Player1, playerMoveID) {
			// PPが無くなっていたら使える技に自動で切り替える
			for _, moveID := range state.Player1.Monster.Moves {
				if battle.CanUseMove(state, battle.Player1, moveID) {
					playerMoveID = moveID
					break
				}
			}
		}

		state = battle.SelectMove(state, battle.Player1, playerMoveID)

		if state.Phase == battle.PhaseFinished {
			break
		}

		opponentMoveID, ok := pickOpponentMove(state)
		if !ok {
			break
		}

		state = battle.SelectMove(state, battle.Player2, opponentMoveID)
	}

	winner := "draw"
	if state.Winner != nil {
		if *state.Winner == battle.Player1 {
			winner = "player"
		} else {
			winner = "opponent"
		}
	}

	if userID, authenticated := userIDFromContext(c); authenticated && state.Winner != nil {
		recordWinner := models.WinnerOpponent
		if winner == "player" {
			recordWinner = models.WinnerPlayer
		}

		_, _ = h.records.Create(c.Request.Context(), models.BattleRecord{
			UserID:            userID,
			PlayerMonsterID:   req.PlayerMonsterID,
			OpponentMonsterID: req.OpponentMonsterID,
			Winner:            recordWinner,
			Turns:             state.Turn,
		})
	}

	c.JSON(http.StatusOK, simulateBattleResponse{
		Winner:     winner,
		Turns:      state.Turn,
		Logs:       state.Logs,
		FinalState: state,
	})
}

func (h *battleHandlers) listMyRecords(c *gin.Context) {
	userID, ok := userIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "認証が必要です"})
		return
	}

	records, err := h.records.ListByUser(c.Request.Context(), userID, 50)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "サーバーエラーが発生しました"})
		return
	}

	c.JSON(http.StatusOK, records)
}
