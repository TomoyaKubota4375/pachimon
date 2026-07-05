import { Button, Card } from "pixel-retroui";

export default function Home() {
  return (
    <main className="p-10">
      <Card className="p-6">
        <h1 className="font-minecraft text-3xl">
          Dungeon Tamer
        </h1>

        <Button className="mt-4">
          Start Game
        </Button>
      </Card>
    </main>
  );
}