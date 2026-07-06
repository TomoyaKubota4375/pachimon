"use client";

import { Button, Card } from "pixel-retroui";
import { useState } from "react";

export default function Login() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    console.log("ログイン:", name, pass);
    window.location.href = "/home";
  };

  return (
    <main
      className="min-h-screen bg-cover bg-top flex items-center justify-center p-10"
      style={{ backgroundImage: "url('/post-bg.png')" }}
    >
      <Card className="p-8 bg-yellow-200 bg-opacity-80 border-4 border-black text-center w-[420px] max-w-[90vw]">

        <h1 className="font-minecraft text-3xl text-blue-600 drop-shadow-[3px_3px_0px_black] mb-6">
          ログイン
        </h1>

        <input
          type="text"
          placeholder="ユーザー名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-black rounded-none text-lg"
        />

        <input
          type="password"
          placeholder="パスワード"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full p-3 mb-6 border-2 border-black rounded-none text-lg"
        />

        <Button
          className="bg-orange-500 text-white font-bold text-lg px-6 py-3 shadow-lg w-full rounded-none"
          onClick={handleLogin}
        >
          ログインする
        </Button>

        <p className="mt-4 text-black font-bold">
          <a href="/signup" className="underline">新規登録はこちら</a>
        </p>

        <Button
          className="bg-gray-600 text-white font-bold text-lg px-6 py-3 shadow-lg w-full mt-4 rounded-none"
          onClick={() => (window.location.href = "/")}
        >
          タイトルへ戻る
        </Button>

      </Card>
    </main>
  );
}
