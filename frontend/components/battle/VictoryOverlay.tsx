type VictoryOverlayProps = {
  winnerName: string;
};

export default function VictoryOverlay({ winnerName }: VictoryOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="animate-bounce rounded-3xl border-4 border-yellow-300 bg-white px-12 py-8 text-center shadow-2xl">
        <p className="text-2xl font-black text-yellow-500">VICTORY</p>
        <h2 className="mt-2 text-5xl font-black text-red-600">
          {winnerName} の勝ち！
        </h2>
      </div>
    </div>
  );
}