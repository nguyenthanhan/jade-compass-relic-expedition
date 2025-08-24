import React from "react";
import { useGame } from "@/contexts/game-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface NewAdventureCardProps {
  onStartGame: () => void;
  canStart: boolean;
  startButtonText: string;
}

export function NewAdventureCard({
  onStartGame,
  canStart,
  startButtonText,
}: NewAdventureCardProps) {
  const { settings, updateSettings } = useGame();
  const { gameConfig } = settings;

  const onChangeRound = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateSettings({
      gameConfig: {
        ...(gameConfig ?? {}),
        rounds: Math.max(
          2,
          Math.min(
            10,
            Number.isNaN(parseInt(e.target.value, 10))
              ? 2
              : parseInt(e.target.value, 10)
          )
        ),
      },
    });

  const onChangeChoicesPerRound = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({
      gameConfig: {
        ...(gameConfig ?? {}),
        choicesPerRound: Math.max(
          2,
          Math.min(
            5,
            Number.isNaN(parseInt(e.target.value, 10))
              ? 2
              : parseInt(e.target.value, 10)
          )
        ),
      },
    });
  };

  return (
    <Card className="relative flex-1">
      <CardHeader>
        <CardTitle>New Adventure</CardTitle>
        <CardDescription className="text-xs">
          Configure your new adventure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Game Settings */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-base mb-2 block">
                Rounds (2-10)
              </label>
              <Input
                type="number"
                min="2"
                max="10"
                value={gameConfig?.rounds ?? 2}
                onChange={onChangeRound}
                className="w-full"
              />
            </div>
            <div>
              <label className="font-pixel text-base mb-2 block">
                Choices per Round (2-5)
              </label>
              <Input
                type="number"
                min="2"
                max="5"
                value={gameConfig?.choicesPerRound ?? 2}
                onChange={onChangeChoicesPerRound}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Button
          className="w-full text-lg pulse"
          onClick={onStartGame}
          disabled={!canStart}
        >
          {startButtonText}
        </Button>
      </CardContent>
    </Card>
  );
}
