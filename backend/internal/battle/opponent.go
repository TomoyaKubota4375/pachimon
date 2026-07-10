package battle

// GetOpponentID は相手側のPlayerIDを返す。
func GetOpponentID(playerID PlayerID) PlayerID {
	if playerID == Player1 {
		return Player2
	}
	return Player1
}
