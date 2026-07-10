"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, verifySession, type Session } from "./auth";

// home以降の全ページで共通のログインガード。
// 未ログインなら即座にタイトルへ戻す。ローカルのセッションが残っていても
// サーバー側でトークンが失効していれば（DBリセット・期限切れ等）verifySessionで検知して弾く。
//
// 戻り値がnullの間は「未ログイン」か「確認中」のどちらか。
// 呼び出し側はnullの間 return null するなどして画面を描画しないこと。
export function useRequireAuth(): Session | null {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const current = getCurrentUser();

    if (!current) {
      window.location.href = "/";
      return;
    }

    setSession(current);

    verifySession().then((valid) => {
      if (!valid) {
        window.location.href = "/";
      }
    });
  }, []);

  return session;
}
