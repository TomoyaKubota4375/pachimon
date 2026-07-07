type BattleLogProps = {
  logs: string[];
};

export default function BattleLog({ logs }: BattleLogProps) {
  return (
    <div className="mt-8 border rounded p-4 h-64 overflow-y-auto">
      <h2 className="font-bold mb-2">ログ</h2>

      {logs.map((log, index) => (
        <p key={index}>{log}</p>
      ))}
    </div>
  );
}