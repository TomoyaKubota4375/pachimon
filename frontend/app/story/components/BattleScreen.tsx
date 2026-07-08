"use client";

type BattleScreenProps = {
  stage: number;
  onBack: () => void;
};

export default function BattleScreen({ stage, onBack }: BattleScreenProps) {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-black text-white">
      <div className="w-[700px] max-w-[90vw] rounded-xl border-4 border-white bg-gray-900 p-8 text-center">
        <p className="text-3xl font-bold text-red-300">
          STAGE {stage} BATTLE
        </p>

        <p className="mt-8 text-lg text-gray-300">
          ここはバトル担当が作成する仮バトル画面です。
        </p>

        <button
          onClick={onBack}
          className="mt-10 rounded-lg bg-white px-8 py-3 font-bold text-black"
        >
          戻る
        </button>
      </div>
    </main>
  );
}