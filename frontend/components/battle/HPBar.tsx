type HPBarProps = {
  hp: number;
  maxHp: number;
};

export default function HPBar({ hp, maxHp }: HPBarProps) {
  const percentage = Math.max(0, (hp / maxHp) * 100);

  let color = "bg-green-500";

  if (percentage <= 50) color = "bg-yellow-500";
  if (percentage <= 20) color = "bg-red-500";

  return (
    <div className="w-64">
      <div className="flex justify-between text-sm mb-1">
        <span>HP</span>
        <span>
          {hp} / {maxHp}
        </span>
      </div>

      <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}