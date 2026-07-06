"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "pixel-retroui";

export default function Home() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    setUser(localStorage.getItem("pachimon_user"));
  }, []);

  const logout = () => {
    localStorage.removeItem("pachimon_user");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0b0f1a] via-[#111a2e] to-[#05070d] relative overflow-hidden">

      {/* 背景エフェクト */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_rgba(0,255,200,0.2),transparent_60%)]" />
      <div className="absolute inset-0 bg-[url('/post-bg.png')] bg-cover bg-center opacity-20" />

      <Card className="relative w-[420px] max-w-[95vw] p-8 bg-black/80 border-4 border-cyan-400 text-white text-center shadow-[0_0_25px_rgba(0,255,255,0.25)]">

        {/* タイトル */}
        <h1 className="text-4xl font-bold tracking-[0.3em] text-cyan-300 drop-shadow">
          PACHIMON
        </h1>

        {/* ユーザー */}
        <p className="mt-3 mb-6 text-sm text-gray-300">
          TRAINER: <span className="text-white font-bold">{user}</span>
        </p>

        {/* メインメニュー */}
        <div className="space-y-4 flex flex-col items-center">

        <Button
          className="w-[320px] h-[56px] flex items-center justify-center text-lg font-bold bg-cyan-400 text-black hover:bg-cyan-300 active:scale-95 transition"
          onClick={() => (window.location.href = "/battle/online")}
        >
          🌐 オンライン対戦
        </Button>

        <Button
          className="w-[320px] h-[56px] flex items-center justify-center text-lg font-bold bg-purple-500 text-white hover:bg-purple-400 active:scale-95 transition"
          onClick={() => (window.location.href = "/battle/local")}
        >
          🎮 ローカル対戦
        </Button>

      </div>

      <div className="mt-6 flex justify-center">
        <Button
          className="w-[320px] h-[48px] flex items-center justify-center text-sm font-bold bg-red-500 text-white hover:bg-red-400 active:scale-95 transition"
          onClick={logout}
        >
          ログアウト
        </Button>
      </div>

      </Card>
    </main>
  );
}