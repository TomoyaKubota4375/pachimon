// 仮実装: バックエンドがまだ無いので localStorage をDB代わりに使っている

export type StoredUser = {
  trainerName: string;
  email: string;
  password: string;
};

type Session = {
  trainerName: string;
  email: string;
};

export type AuthResult = { ok: true } | { ok: false; message: string };

const USERS_KEY = "pachimon_users";
const SESSION_KEY = "pachimon_session";

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

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

export function signup(
  trainerName: string,
  email: string,
  password: string
): AuthResult {
  const name = trainerName.trim();
  const mail = email.trim();

  if (!name) return { ok: false, message: "トレーナー名を入力してください" };
  if (!mail) return { ok: false, message: "メールアドレスを入力してください" };
  if (!mail.includes("@"))
    return { ok: false, message: "メールアドレスが正しくありません" };
  if (password.length < 6)
    return { ok: false, message: "パスワードは6文字以上です" };

  const users = readUsers();

  if (users.some((u) => u.email === mail)) {
    return { ok: false, message: "このメールアドレスは登録済みです" };
  }

  users.push({ trainerName: name, email: mail, password });
  writeUsers(users);
  writeSession({ trainerName: name, email: mail });

  return { ok: true };
}

export function login(email: string, password: string): AuthResult {
  const mail = email.trim();

  if (!mail) return { ok: false, message: "メールアドレスを入力してください" };
  if (!password.trim())
    return { ok: false, message: "パスワードを入力してください" };

  const users = readUsers();
  const user = users.find((u) => u.email === mail && u.password === password);

  if (!user) {
    return { ok: false, message: "メールアドレスまたはパスワードが違います" };
  }

  writeSession({ trainerName: user.trainerName, email: user.email });

  return { ok: true };
}
