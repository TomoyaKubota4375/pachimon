type VictoryOverlayProps = {
  winnerName: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function VictoryOverlay({
  winnerName,
  actionLabel,
  onAction,
}: VictoryOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="rounded-3xl border-4 border-yellow-300 bg-white px-12 py-8 text-center shadow-2xl">
        <p className="text-2xl font-black text-yellow-500">
          VICTORY
        </p>

        <h2 className="mt-2 text-5xl font-black text-red-600">
          {winnerName} の勝ち！
        </h2>

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-8 rounded-xl bg-black px-8 py-3 text-lg font-bold text-white transition hover:bg-gray-800"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}