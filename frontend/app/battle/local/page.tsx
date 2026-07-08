import BattleScreen from "@/components/battle/BattleScreen";
import { initialBattleState } from "@/features/battle/data/initialBattleState";

export default function LocalBattlePage() {
  return <BattleScreen mode="local" initialState={initialBattleState} />;
}