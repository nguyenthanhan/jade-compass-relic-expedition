import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function IntroductionCard() {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="text-[var(--primary)]">🌟 Introduction</CardTitle>
        <CardDescription className="text-xs">
          Welcome to your treasure hunting adventure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="text-[var(--accent)] text-lg">🎯</span>
            <div>
              <h4 className="font-pixel text-sm text-[var(--primary)] mb-1">
                Objective
              </h4>
              <p className="font-retro text-xs text-[var(--muted-foreground)]">
                Navigate through all rounds to claim the legendary Jade Compass.
                Only one path leads to victory!
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-[var(--accent)] text-lg">⚡</span>
            <div>
              <h4 className="font-pixel text-sm text-[var(--primary)] mb-1">
                Gameplay
              </h4>
              <p className="font-retro text-xs text-[var(--muted-foreground)]">
                Each round presents multiple choices. Choose wisely - wrong
                decisions end your journey immediately.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-[var(--accent)] text-lg">🎮</span>
            <div>
              <h4 className="font-pixel text-sm text-[var(--primary)] mb-1">
                Controls
              </h4>
              <p className="font-retro text-xs text-[var(--muted-foreground)]">
                Use number keys 1-5 for quick selection during gameplay. Mouse
                clicks also work!
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-[var(--accent)] text-lg">🏆</span>
            <div>
              <h4 className="font-pixel text-sm text-[var(--primary)] mb-1">
                Victory
              </h4>
              <p className="font-retro text-xs text-[var(--muted-foreground)]">
                Survive all rounds to claim the Jade Compass and become a
                legendary treasure hunter!
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--border)]">
          <p className="font-retro text-xs text-[var(--accent)]">
            💡 <strong>Pro Tip:</strong> Pay attention to the narrative state -
            it evolves with each choice and provides clues for future decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
