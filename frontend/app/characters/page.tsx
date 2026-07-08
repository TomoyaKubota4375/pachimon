import { Suspense } from "react";
import CharacterSelectScreen from "@/components/characters/CharacterSelectScreen";

export default function CharacterSelectPage() {
  return (
    <Suspense fallback={null}>
      <CharacterSelectScreen />
    </Suspense>
  );
}
