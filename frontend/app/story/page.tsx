"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const stages = [
  "/image/Stage1.png",
  "/image/Stage2.png",
  "/image/Stage3.png",
  "/image/Stage4.png",
  "/image/Stage5.png",
];

const storyTexts = [
  "ある日、街のポストに謎のケーブルが刺さった。",
  "それは、異世界から伸びる「人格データ通信線」だった。",
  "ケーブルは人間の心のデータを吸い出し、暴走を始める。",
  "感情。性格。欲望。",
  "人間の心は姿を持ち、「人格もん」として現実世界に現れた。",
  "街中のポストは、異世界とつながる「人格ゲート」と化していく。",
  "そして、普通の高校生だったあなたは――",
  "「人格ゲート管理者」に選ばれた。",
  "暴走した人格もんを回収し、人格データを安定させろ。",
  "そして、ケーブルが暴走した原因を突き止めろ。",
];

const postMessages = [
  "「最初の人格データを確認。暴走レベルはまだ低い。」",
  "「商店街一帯で人格データの混線を確認。注意してください。」",
  "「感情データが異常に増幅しています。公園のゲートを安定化してください。」",
  "「工業地帯のケーブルが人格ゲートを強制拡張しています。」",
  "「最終ゲートを確認。これ以上の暴走は世界全体に影響します。」",
];

const postPositions = [
  { x: 0.74, y: 300, width: 250 },
  { x: 0.78, y: 305, width: 250 },
  { x: 0.76, y: 300, width: 250 },
  { x: 0.76, y: 305, width: 250 },
  { x: 0.52, y: 295, width: 260 },
];

export default function StoryPage() {
  const router = useRouter();
  const [titleStarted, setTitleStarted] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const [stageIndex, setStageIndex] = useState(0);
  const [playerX, setPlayerX] = useState(80);
  const [playerY, setPlayerY] = useState(430);

  const [postEventStarted, setPostEventStarted] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);
  const [clearStarted, setClearStarted] = useState(false);
  const [stageChanging, setStageChanging] = useState(false);

  const [screenWidth, setScreenWidth] = useState(1200);
  const [screenHeight, setScreenHeight] = useState(700);

  const stageChangingRef = useRef(false);

  const speed = 18;
  const START_X = 80;
  const START_Y = 430;
  const MIN_Y = 260;
  const MAX_Y = screenHeight - 150;

  const post = postPositions[stageIndex];
  const postX = screenWidth * post.x;
  const postY = post.y;

  const isNearPost =
    Math.abs(playerX - postX) < 180 && Math.abs(playerY - postY) < 190;

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  const nextStory = () => {
    if (storyIndex < storyTexts.length - 1) {
      setStoryIndex((index) => index + 1);
    } else {
      setGameStarted(true);
      setPlayerX(START_X);
      setPlayerY(START_Y);
    }
  };

  const skipStory = () => {
    setGameStarted(true);
    setPlayerX(START_X);
    setPlayerY(START_Y);
  };

  const resetPlayerToLeft = () => {
    setPlayerX(START_X);
    setPlayerY(START_Y);
  };

  const closeBattle = () => {
    setBattleStarted(false);
    setPostEventStarted(false);
  };

  const moveToNextStage = () => {
    if (stageChangingRef.current) return;

    if (stageIndex >= stages.length - 1) {
      setClearStarted(true);
      return;
    }

    stageChangingRef.current = true;
    setStageChanging(true);

    setTimeout(() => {
      setStageIndex((current) => current + 1);
      resetPlayerToLeft();
      setPostEventStarted(false);
      setBattleStarted(false);
      setStageChanging(false);
      stageChangingRef.current = false;
    }, 500);
  };

  const movePlayer = (key: string) => {
    if (stageChangingRef.current) return;

    if (key === "ArrowUp") {
      setPlayerY((y) => Math.max(MIN_Y, y - speed));
      return;
    }

    if (key === "ArrowDown") {
      setPlayerY((y) => Math.min(MAX_Y, y + speed));
      return;
    }

    if (key === "ArrowLeft") {
      setPlayerX((x) => Math.max(0, x - speed));
      return;
    }

    if (key === "ArrowRight") {
      setPlayerX((x) => {
        const nextX = x + speed;

        if (nextX >= screenWidth - 110) {
          moveToNextStage();
          return x;
        }

        return nextX;
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!titleStarted && event.key === "Enter") {
        setTitleStarted(true);
        return;
      }

      if (titleStarted && !gameStarted && event.key === "Enter") {
        nextStory();
        return;
      }

      if (battleStarted && event.key === "Escape") {
        closeBattle();
        return;
      }

      if (clearStarted || stageChanging) return;

      if (gameStarted && event.key === "Enter" && isNearPost) {
        if (!postEventStarted) {
          setPostEventStarted(true);
        } else {
          setBattleStarted(true);
        }
        return;
      }

      if (gameStarted && !postEventStarted && !battleStarted) {
        movePlayer(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    titleStarted,
    gameStarted,
    storyIndex,
    stageIndex,
    isNearPost,
    postEventStarted,
    battleStarted,
    clearStarted,
    stageChanging,
    screenWidth,
    screenHeight,
  ]);

  if (!titleStarted) {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-sm tracking-[0.4em] text-cyan-300">
            PERSONALITY GATE
          </p>

          <h1 className="mt-6 text-6xl font-black tracking-widest">
            人格もん
          </h1>

          <p className="mt-6 text-lg text-gray-300">
            暴走した人格データを回収せよ
          </p>

          <button
            onClick={() => setTitleStarted(true)}
            className="mt-14 rounded-xl border-4 border-white bg-white px-10 py-4 text-xl font-bold text-black"
          >
            GAME START
          </button>

          <p className="mt-6 text-sm text-gray-400">
            Enterキーでも開始できます
          </p>
        </div>
      </main>
    );
  }

  if (!gameStarted) {
    return (
      <main
        className="relative flex h-screen w-screen cursor-pointer items-center justify-center bg-black text-white"
        onClick={nextStory}
      >
        <button
          onClick={(event) => {
            event.stopPropagation();
            skipStory();
          }}
          className="absolute right-8 top-8 rounded-lg border border-gray-400 px-5 py-2 text-sm text-gray-300 hover:bg-white hover:text-black"
        >
          スキップ
        </button>

        <div className="w-[800px] max-w-[90vw] text-center">
          <p className="text-3xl font-bold leading-relaxed">
            {storyTexts[storyIndex]}
          </p>

          <p className="mt-12 text-sm text-gray-400">
            クリック または Enter で次へ
          </p>
        </div>
      </main>
    );
  }

  if (clearStarted) {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <div className="w-[850px] max-w-[90vw] text-center">
          <p className="text-5xl font-black text-yellow-300">CLEAR</p>

          <p className="mt-10 text-2xl font-bold">
            暴走していた人格ゲートは静かに閉じた。
          </p>

          <p className="mt-8 text-lg leading-relaxed text-gray-300">
            街にあふれていた人格データは安定し、
            <br />
            人格もんたちは少しずつ元の世界へ帰っていった。
            <br />
            しかし、最後にポストから聞こえた声は、
            <br />
            まだ終わりではないことを告げていた。
          </p>

          <div className="mt-12 space-y-3 text-gray-400">
            <p>人格ゲート管理者</p>
            <p className="text-xl text-white">YOU</p>

            <p className="pt-6">回収された人格もん</p>
            <p className="text-white">住宅街の人格もん</p>
            <p className="text-white">商店街の人格もん</p>
            <p className="text-white">公園の人格もん</p>
            <p className="text-white">工業地帯の人格もん</p>
            <p className="text-white">最終人格データ</p>

            <p className="pt-8 text-sm text-gray-500">
              Thank you for playing
            </p>
            <button
  onClick={() => router.push("/home")}
  className="mt-8 rounded-xl border-2 border-white px-8 py-3 text-lg font-bold text-white hover:bg-white hover:text-black"
>
  ホームに戻る
</button>
          </div>
        </div>
      </main>
    );
  }

  if (battleStarted) {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-purple-950 text-white">
        <div className="text-center">
          <h1 className="text-6xl font-black text-red-300">BATTLE START</h1>
          <p className="mt-8 text-2xl">ポストの魔力が襲いかかってきた！</p>
          <p className="mt-10 text-gray-300">Escキーでステージに戻る</p>

          <button
            onClick={closeBattle}
            className="mt-8 rounded-xl border-2 border-white px-8 py-3 text-lg font-bold hover:bg-white hover:text-purple-950"
          >
            ステージに戻る
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="relative h-screen w-screen overflow-hidden"
      style={{
        backgroundImage: `url(${stages[stageIndex]})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {stageChanging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <p className="text-3xl font-bold text-cyan-300">
              人格ゲート反応を検知
            </p>
            <p className="mt-6 text-lg text-gray-300">
              次のエリアへ移動中……
            </p>
          </div>
        </div>
      )}

      <img
        src="/image/Post.png"
        alt="post"
        style={{
          position: "absolute",
          left: `${postX}px`,
          top: `${postY}px`,
          width: `${post.width}px`,
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      />

      {isNearPost && !postEventStarted && (
        <div
          style={{
            position: "absolute",
            left: `${postX}px`,
            top: `${postY - 75}px`,
            transform: "translateX(-50%)",
            color: "yellow",
            fontSize: 64,
            fontWeight: "bold",
            textShadow: "0 0 12px black",
            zIndex: 10,
          }}
        >
          !
        </div>
      )}

      <img
        src="/image/Player.png"
        alt="player"
        style={{
          position: "absolute",
          left: `${playerX}px`,
          top: `${playerY}px`,
          width: "180px",
          zIndex: 5,
        }}
      />

      <div className="absolute bottom-6 left-1/2 z-40 w-[760px] max-w-[90vw] -translate-x-1/2 rounded-xl border-4 border-white bg-black/80 p-4 text-white">
        {!postEventStarted ? (
          <>
            <p className="text-lg font-bold">
              矢印キーで主人公を操作しよう。
            </p>

            <p className="mt-1 text-sm text-gray-300">
              {isNearPost
                ? "Enterキーでポストに話しかける。"
                : "右端まで進むと次のステージへ移動します。"}
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold text-yellow-300">
              ポストから声が聞こえる……
            </p>

            <p className="mt-1 text-sm text-gray-300">
              {postMessages[stageIndex]}
            </p>

            <p className="mt-2 text-sm text-red-300">
              Enterキーで仮バトル画面へ進む。
            </p>
          </>
        )}
      </div>
    </main>
  );
}