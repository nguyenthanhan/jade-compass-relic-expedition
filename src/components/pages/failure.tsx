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
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center space-y-4">
          {gameState.overallTheme && (
            <h1 className="font-pixel text-3xl text-[var(--accent)] mb-4">
              {gameState.overallTheme}
            </h1>
          )}

          <div className="relative inline-block">
            <Skull
              className="h-24 w-24 text-[var(--destructive)] mx-auto"
              aria-hidden="true"
            />
            <X
              aria-hidden="true"
              className="h-24 w-24 text-[var(--destructive)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blink"
            />
          </div>

          <h2 className="font-pixel text-3xl text-[var(--destructive)]">
            GAME OVER
          </h2>

          <p className="font-retro text-xl text-[var(--muted-foreground)]">
            Your adventure ends here...
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What Happened</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gameState.choiceHistory.length > 0 && (
              <div className="border-b border-[var(--border)] pt-4">
                <h4 className="font-pixel text-sm text-[var(--primary)] mb-2">
                  Last Choice
                </h4>
                <div className="p-3 bg-[var(--muted)]/10 rounded">
                  <p className="font-retro text-sm font-semibold text-[var(--primary)]">
                    {
                      gameState.choiceHistory[
                        gameState.choiceHistory.length - 1
                      ]?.title
                    }
                  </p>
                  <p className="font-retro text-xs text-[var(--muted-foreground)] mt-1">
                    {
                      gameState.choiceHistory[
                        gameState.choiceHistory.length - 1
                      ]?.summary
                    }
                  </p>
                </div>
              </div>
            )}

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
              <p>
                <span className="text-[var(--muted-foreground)]">Status: </span>
                <span className="text-[var(--primary)]">
                  {gameState.narrativeState.status}
                </span>
              </p>
              {gameState.narrativeState.storyProgress && (
                <p>
                  <span className="text-[var(--muted-foreground)]">
                    Progress:{" "}
                  </span>
                  <span className="text-[var(--accent)]">
                    {gameState.narrativeState.storyProgress}
                  </span>
                </p>
              )}
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
