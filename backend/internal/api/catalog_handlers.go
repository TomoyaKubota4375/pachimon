package api

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/TomoyaKubota4375/pachimon/backend/internal/battle"
)

// listMonsters はfeatures/battle/data/monsters.tsに対応するモンスター一覧を返す。
func listMonsters(c *gin.Context) {
	c.JSON(http.StatusOK, battle.Monsters)
}

// listMoves はfeatures/battle/data/moves.tsに対応する技一覧を返す。
func listMoves(c *gin.Context) {
	c.JSON(http.StatusOK, battle.Moves)
}
