import type { BattlePlayer } from "@/features/battle/types";
import HPBar from "./HPBar";

type MonsterStatusProps = {
  player: BattlePlayer;
};

export default function MonsterStatus({ player }: MonsterStatusProps) {
  return (
    <div className="mb-8">
      <h2 className="font-bold text-xl">{player.name}</h2>
      <p>{player.monster.name}</p>

      <HPBar
        hp={player.monster.hp}
        maxHp={player.monster.maxHp}
      />
    </div>
  );
}