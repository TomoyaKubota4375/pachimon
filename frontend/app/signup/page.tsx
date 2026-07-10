"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Input, Popup } from "pixel-retroui";
import { isLoggedIn, signup } from "@/lib/auth";

export default function Signup() {
  const [trainerName, setTrainerName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      window.location.href = "/home";
    }
  }, []);

  const openPopup = (msg: string) => {
    setPopupMessage(msg);
    setIsPopupOpen(true);
  };

  const closePopup = () => setIsPopupOpen(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    const result = await signup(trainerName, email, pass);
    setIsSubmitting(false);

    if (!result.ok) {
      openPopup(result.message);
      return;
    }

    window.location.href = "/home";
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-10"
      style={{ backgroundImage: "url('/post-bg.png')" }}
    >
      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <div className="p-4 text-center">
          <p className="font-bold mb-4">{popupMessage}</p>

          <Button
            className="w-full bg-red-500 text-white"
            onClick={closePopup}
          >
            閉じる
          </Button>
        </div>
      </Popup>

      <Card className="w-[430px] p-8 bg-yellow-200/90 border-4 border-black text-center">

        <h1 className="text-4xl font-bold mb-2">
          PACHIMON
        </h1>

        <p className="mb-6 text-lg">
          新規トレーナー登録
        </p>

        <form onSubmit={handleSignup}>
          <Input
            type="text"
            placeholder="トレーナー名"
            value={trainerName}
            onChange={(e) => setTrainerName(e.target.value)}
            className="w-full mb-4"
          />

          <Input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4"
          />

          <Input
            type="password"
            placeholder="パスワード"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full mb-6"
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white font-bold py-3 disabled:opacity-50"
          >
            {isSubmitting ? "登録中..." : "新規登録"}
          </Button>
        </form>

        <p className="mt-5">
          すでにアカウントをお持ちですか？
        </p>

        <Button
          className="w-full mt-2 bg-blue-600 text-white font-bold py-3"
          onClick={() => (window.location.href = "/login")}
        >
          ログイン
        </Button>

        <Button
          className="w-full mt-4 bg-gray-700 text-white font-bold py-3"
          onClick={() => (window.location.href = "/")}
        >
          タイトルへ戻る
        </Button>

      </Card>
    </main>
  );
}
