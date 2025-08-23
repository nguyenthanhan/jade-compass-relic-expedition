"use client";

import React, { useState } from "react";
import { useGame } from "@/contexts/game-context";
import { toast } from "sonner";
import {
  GameHeader,
  IntroductionCard,
  NewAdventureCard,
  AIConfigurationCard,
  providerData,
} from "@/components/home";

export function HomePage() {
  const { startGame, apiKey, isLoadingSettings, settings } = useGame();
  const { provider } = settings?.providerConfig || {};

  const [showApiKey, setShowApiKey] = useState(false);

  const handleStartGame = async () => {
    if (!apiKey) {
      toast.error("Please enter your API key first");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    await startGame();
  };

  // Determine button text based on current form state
  const getStartButtonText = () => {
    if (!apiKey) {
      return "⚠️ Enter API Key to Start";
    }
    return `🚀 START ADVENTURE (${
      providerData[provider ?? "openrouter"].providerName
    })`;
  };

  const canStart = () => {
    return !!apiKey;
  };

  if (isLoadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
          <p className="font-pixel text-lg text-[var(--primary)]">
            Loading app...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <GameHeader />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-3 flex flex-col space-y-4">
              <IntroductionCard />
              <NewAdventureCard
                onStartGame={handleStartGame}
                canStart={canStart()}
                startButtonText={getStartButtonText()}
              />
            </div>

            {/* Right Column - Settings */}
            <div className="lg:col-span-2 space-y-6">
              <AIConfigurationCard
                showApiKey={showApiKey}
                onToggleApiKeyVisibility={() => setShowApiKey(!showApiKey)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
