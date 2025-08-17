"use client";

import { useGame } from "@/contexts/game-context";
import { HomePage } from "@/components/pages/home";
import { GamePage } from "@/components/pages/game";
import { VictoryPage } from "@/components/pages/victory";
import { FailurePage } from "@/components/pages/failure";

export default function Home() {
  const { gameState } = useGame();

  switch (gameState.status) {
    case "idle":
      return <HomePage />;
    case "playing":
      return <GamePage />;
    case "victory":
      return <VictoryPage />;
    case "failure":
      return <FailurePage />;
    default:
      return <HomePage />;
  }
}
