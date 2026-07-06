"use client";

import React, { useState } from "react";
import { Button, Card, Popup } from "pixel-retroui";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const openPopup = (msg: string) => {
    setPopupMessage(msg);
    setIsPopupOpen(true);
  };

  const closePopup = () => setIsPopupOpen(false);

  const handleSignup = () => {
    if (!email.includes("@") || !email.includes(".com")) {
      openPopup("メールアドレスを正しく入力してください");
      return;
    }

    if (!pass) {
      openPopup("パスワードを入力してください");
      return;
    }

    // 仮登録 → 仮ログイン扱い
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("email", email);

    window.location.href = "/home";
  };

  return (
    <main
      className="min-h-screen bg-cover bg-top flex items-center justify-center p-10"
      style={{ backgroundImage: "url('/post-bg.png')" }}
    >
      {/* Popup */}
      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <div className="p-4 text-center">
          <p className="font-bold mb-4">{popupMessage}</p>
          <Button
            className="bg-red-500 text-white px-4 py-2 w-full rounded-none"
            onClick={closePopup}
          >
            閉じる
          </Button>
        </div>
      </Popup>

      <Card className="p-8 bg-yellow-200 bg-opacity-80 border-4 border-black text-center w-[420px]">
        <h1 className="text-3xl mb-6">新規登録</h1>

        <input
          type="text"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-black rounded-none"
        />

        <input
          type="password"
          placeholder="パスワード"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full p-3 mb-6 border-2 border-black rounded-none"
        />

        <Button
          className="bg-green-500 text-white font-bold px-6 py-3 w-full rounded-none"
          onClick={handleSignup}
        >
          登録する
        </Button>

        <p className="mt-4">
          <a href="/login" className="underline">ログインはこちら</a>
        </p>

        <Button
          className="bg-gray-600 text-white font-bold px-6 py-3 w-full rounded-none mt-4"
          onClick={() => (window.location.href = "/")}
        >
          タイトルへ戻る
        </Button>
      </Card>
    </main>
  );
}
