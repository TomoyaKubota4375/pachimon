"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "pixel-retroui";
import { getCurrentUser, logout as clearSession } from "@/lib/auth";

export default function Home() {
  const [trainerName, setTrainerName] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      window.location.href = "/";
      return;
    }

    setTrainerName(user.trainerName);
  }, []);

  const movePage = (path: string) => {
    window.location.href = path;
  };

  const logout = () => {
    clearSession();
    window.location.href = "/";
  };

  // 未ログイン判定 or リダイレクト中はメニューを描画しない
  if (!trainerName) {
    return null;
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/post-bg.png')",
      }}
    >
      {/* 背景を暗くする */}
      <div className="absolute inset-0 bg-black/45"></div>

      {/* メニュー */}
      <Card className="relative z-8 w-[500px] max-w-[92vw] rounded-xl border-4 border-yellow-300 bg-black/70 p-8 text-white backdrop-blur-sm">

        {/* タイトル */}
        <h1 className="text-center text-6xl font-bold tracking-[0.25em] text-yellow-300 drop-shadow-[0_0_15px_gold]">
          PACHIMON
        </h1>

        <p className="mt-2 text-center text-gray-300">
          Monster Battle Game
        </p>

        {/* トレーナー */}
        <div className="mt-8 rounded-lg border-2 border-cyan-300 bg-black/60 p-2 text-center">

          <p className="text-sm tracking-widest text-cyan-300">
            TRAINER
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {trainerName}
          </p>

        </div>

        {/* メニュー */}
        <div className="mt-8 flex flex-col gap-3">

          <Button
  className="h-10 text-xl font-bold bg-yellow-400 text-black transition-all hover:scale-105 hover:brightness-110 active:scale-95"
  onClick={() => movePage("/story")}
>
  📖 ストーリーモード
</Button>

          <Button
            className="h-10 text-xl font-bold bg-green-500 text-black transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            onClick={() => movePage("/battle/online")}
          >
            🌐 オンライン対戦
          </Button>

          <Button
            className="h-10 text-xl font-bold bg-blue-500 text-white transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            onClick={() => movePage("/battle/local")}
          >
            🎮 ローカル対戦
          </Button>

        {/* ログアウト */}
          <Button
            className="h-8 text-lg font-bold bg-red-500 text-white transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            onClick={logout}
          >
            🚪 ログアウト
          </Button>

        </div>

        {/* バージョン */}
        <div className="mt-8 border-t border-gray-500 pt-4 text-center text-sm text-gray-300">
          Version 0.1.0
        </div>

      </Card>
    </main>
  );
}
