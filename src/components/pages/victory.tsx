"use client";

import React from "react";
import { useGame } from "@/contexts/game-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles } from "lucide-react";

export function VictoryPage() {
  const { gameState, gameConfig, resetGame } = useGame();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <Trophy className="h-24 w-24 text-[var(--accent)] float mx-auto" />
            <Sparkles className="h-8 w-8 text-[var(--primary)] absolute -top-2 -right-2 pulse" />
            <Sparkles className="h-6 w-6 text-[var(--primary)] absolute -bottom-1 -left-1 pulse" />
          </div>

          <h1 className="font-pixel text-3xl text-[var(--primary)]">
            VICTORY!
          </h1>

          <p className="font-pixel text-xl text-[var(--accent)]">
            Congratulations! You have found the pot.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Adventure Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="font-retro space-y-2">
              <p>
                <span className="text-[var(--muted-foreground)]">
                  Rounds Completed:{" "}
                </span>
                <span className="text-[var(--primary)]">
                  {gameConfig.rounds}
                </span>
              </p>
              <p>
                <span className="text-[var(--muted-foreground)]">
                  Final Location:{" "}
                </span>
                <span className="text-[var(--accent)]">
                  {gameState.narrativeState.location}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full text-lg pulse" onClick={resetGame}>
          PLAY AGAIN
        </Button>
      </div>
    </div>
  );
}
export default VictoryPage;
