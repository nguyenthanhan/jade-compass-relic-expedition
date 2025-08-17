"use client";

import React from "react";
import { useGame } from "@/contexts/game-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skull, X } from "lucide-react";

export function FailurePage() {
  const { gameState, resetGame } = useGame();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <Skull className="h-24 w-24 text-[var(--destructive)] mx-auto" />
            <X className="h-12 w-12 text-[var(--destructive)] absolute top-6 left-6 blink" />
          </div>

          <h1 className="font-pixel text-3xl text-[var(--destructive)]">
            GAME OVER
          </h1>

          <p className="font-retro text-xl text-[var(--muted-foreground)]">
            Your adventure ends here...
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What Happened</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-[var(--destructive)]/10 pixel-border">
              <p className="font-retro text-[var(--destructive)]">
                {gameState.failureReason}
              </p>
            </div>

            <div className="font-retro space-y-2">
              <p>
                <span className="text-[var(--muted-foreground)]">
                  Round Reached:{" "}
                </span>
                <span className="text-[var(--primary)]">
                  {gameState.currentRound}
                </span>
              </p>
              <p>
                <span className="text-[var(--muted-foreground)]">
                  Last Location:{" "}
                </span>
                <span className="text-[var(--accent)]">
                  {gameState.narrativeState.location}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full text-lg" onClick={resetGame}>
          TRY AGAIN
        </Button>
      </div>
    </div>
  );
}
export default FailurePage;
