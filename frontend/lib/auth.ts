// Goバックエンド（backend/）のユーザー認証APIを呼ぶ。
// セッション（トークン＋表示用の名前）はlocalStorageに保持し、
// 同期的にログイン状態を読みたい画面（home等）が困らないようにしている。
import { apiFetch, ApiError } from "./api";

export type Session = {
  token: string;
  trainerName: string;
  email: string;
};

export type AuthResult = { ok: true } | { ok: false; message: string };

const SESSION_KEY = "pachimon_session";

type AuthApiResponse = {
  token: string;
  user: {
    id: string;
    trainerName: string;
    email: string;
  };
};

function writeSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getCurrentUser(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export async function signup(
  trainerName: string,
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const data = await apiFetch<AuthApiResponse>("/api/auth/signup", {
      method: "POST",
      body: { trainerName, email, password },
    });

    writeSession({
      token: data.token,
      trainerName: data.user.trainerName,
      email: data.user.email,
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, message: toErrorMessage(error) };
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const data = await apiFetch<AuthApiResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    writeSession({
      token: data.token,
      trainerName: data.user.trainerName,
      email: data.user.email,
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, message: toErrorMessage(error) };
  }
}

// トークンがサーバー側でもまだ有効か確認する。
// 期限切れ・DBリセット等で無効になっていたらローカルのセッションも消す。
export async function verifySession(): Promise<boolean> {
  const session = getCurrentUser();
  if (!session) return false;

  try {
    await apiFetch("/api/me", { token: session.token });
    return true;
  } catch {
    logout();
    return false;
  }
}

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "サーバーに接続できませんでした";
}
