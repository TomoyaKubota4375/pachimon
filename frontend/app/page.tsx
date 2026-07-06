"use client";

import { Button, Card } from "pixel-retroui";

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover bg-top flex flex-col justify-end"
      style={{ backgroundImage: "url('/post-bg.png')" }}
    >
      <Card className="p-6 bg-yellow-200 bg-opacity-80 border-4 border-black text-center mb-10 mt-40">

        <div className="flex justify-center gap-6">
          {/* 新規登録へ遷移 */}
          <Button
           
            onClick={() => (window.location.href = "/signup")}
          >
            新規登録
          </Button>

          {/* ログインへ遷移 */}
          <Button
           
            onClick={() => (window.location.href = "/login")}
          >
            ログイン
          </Button>
        </div>

      </Card>
    </main>
  );
}


