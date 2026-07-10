// 対戦中の部屋コードをsessionStorageに置いておく。
// ページを誤って更新してしまった・回線が一瞬切れた、といったときに
// 同じ部屋へ自動で再接続(rejoin_room)するために使う。
const ROOM_CODE_KEY = "pachimon_online_room";

export function saveActiveRoomCode(roomCode: string) {
  sessionStorage.setItem(ROOM_CODE_KEY, roomCode);
}

export function getActiveRoomCode(): string | null {
  return sessionStorage.getItem(ROOM_CODE_KEY);
}

export function clearActiveRoomCode() {
  sessionStorage.removeItem(ROOM_CODE_KEY);
}
