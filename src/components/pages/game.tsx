"use client";

import React, { useEffect, useState } from "react";
import { useGame } from "@/contexts/game-context";
import { Choice } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function GamePage() {
  const { gameState, gameConfig, makeChoice, currentRoundData, isLoading } =
    useGame();

  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!currentRoundData || isProcessing) return;

      const key = parseInt(e.key);
      if (key >= 1 && key <= currentRoundData.choices.length) {
        const choice = currentRoundData.choices[key - 1];
        handleChoice(choice);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [currentRoundData, isProcessing]);

  const handleChoice = async (choice: Choice) => {
    if (isProcessing) return;

    setSelectedChoice(choice);
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await makeChoice(choice);
    setIsProcessing(false);
    setSelectedChoice(null);
  };

  if (isLoading || !currentRoundData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--primary)] mx-auto" />
          <p className="font-pixel text-lg">Loading adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-pixel text-2xl text-[var(--primary)]">
            Round {gameState.currentRound} of {gameConfig.rounds}
          </h2>
          {gameState.intro && gameState.currentRound === 1 && (
            <p className="font-retro text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {gameState.intro}
            </p>
          )}
        </div>

        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-4 text-sm font-retro">
              <div>
                <span className="text-[var(--muted-foreground)]">
                  Location:{" "}
                </span>
                <span className="text-[var(--accent)]">
                  {currentRoundData?.narrative_state.location ||
                    gameState.narrativeState.location}
                </span>
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Status: </span>
                <span className="text-[var(--primary)]">
                  {currentRoundData?.narrative_state.status ||
                    gameState.narrativeState.status}
                </span>
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Items: </span>
                <span>
                  {(
                    currentRoundData?.narrative_state.items ||
                    gameState.narrativeState.items
                  ).join(", ") || "None"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentRoundData?.choices.map((choice, index) => (
            <Card
              key={choice.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedChoice?.id === choice.id
                  ? "ring-4 ring-[var(--primary)]"
                  : ""
              } ${
                isProcessing && selectedChoice?.id !== choice.id
                  ? "opacity-50"
                  : ""
              }`}
              onClick={() => handleChoice(choice)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{choice.title}</span>
                  <span className="font-pixel text-xs text-[var(--muted-foreground)]">
                    [{index + 1}]
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-retro text-[var(--muted-foreground)]">
                  {choice.summary}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
export default GamePage;
