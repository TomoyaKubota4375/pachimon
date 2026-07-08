type BattleLogProps = {
  log: string;
};

export default function BattleLog({ log }: BattleLogProps) {
  return (
    <div className="min-h-64 rounded-2xl border-2 border-white/60 bg-black/80 p-6 text-white shadow-2xl backdrop-blur">
      <div className="mb-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-yellow-300" />
        <h2 className="text-2xl font-black text-yellow-300">バトルログ</h2>
        <div className="h-px flex-1 bg-yellow-300" />
      </div>

      <p className="mt-8 text-2xl font-black leading-relaxed">{log}</p>
    </div>
  );
}