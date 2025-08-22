"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import {
  GameConfig,
  GameState,
  ProviderConfig,
  Choice,
  GameRound,
} from "@/types/game";
import { ProviderFactory } from "@/lib/providers/provider-factory";
import { toast } from "sonner";

interface GameContextType {
  gameConfig: GameConfig;
  gameState: GameState;
  sessionSeed: string;
  allRounds: GameRound[] | null;
  currentRoundData: GameRound | null;
  isLoading: boolean;
  loadingMessage?: string;
  updateConfig: (config: Partial<GameConfig>) => void;
  startGame: () => Promise<void>;
  makeChoice: (choice: Choice) => Promise<void>;
  resetGame: () => void;
  testConnection: () => Promise<boolean>;
  testConnectionWith: (config: ProviderConfig) => Promise<boolean>;
}

const defaultConfig: GameConfig = {
  rounds: 2,
  choicesPerRound: 2,
  providerConfig: {
    provider: "gemini",
  },
};

const defaultGameState: GameState = {
  status: "idle",
  currentRound: 0,
  narrativeState: {
    location: "Unknown",
    status: "Ready",
    items: [],
  },
  choiceHistory: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameConfig, setGameConfig] = useState<GameConfig>(defaultConfig);
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [sessionSeed] = useState(() => Math.random().toString(36).substring(7));
  const [allRounds, setAllRounds] = useState<GameRound[] | null>(null);
  const [currentRoundData, setCurrentRoundData] = useState<GameRound | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (
      allRounds &&
      gameState.currentRound > 0 &&
      gameState.currentRound <= allRounds.length
    ) {
      setCurrentRoundData(allRounds[gameState.currentRound - 1]);
    }
  }, [gameState.currentRound, allRounds]);

  const updateConfig = useCallback((config: Partial<GameConfig>) => {
    setGameConfig((prev) => ({ ...prev, ...config }));
  }, []);

  const testConnectionWith = useCallback(async (config: ProviderConfig) => {
    try {
      setIsLoading(true);
      setLoadingMessage("Testing connection…");
      const testProvider = ProviderFactory.create(config);
      const result = await testProvider.testConnection();
      if (result) {
        toast.success("Connection successful!");
      } else {
        toast.error("Connection failed. Please check your settings.");
      }
      return result;
    } catch (error) {
      toast.error("Connection failed: " + (error as Error).message);
      return false;
    } finally {
      setIsLoading(false);
      setLoadingMessage(undefined);
    }
  }, []);

  const testConnection = useCallback(async () => {
    return testConnectionWith(gameConfig.providerConfig);
  }, [gameConfig.providerConfig, testConnectionWith]);

  const startGame = useCallback(async () => {
    try {
      const provider = ProviderFactory.create(gameConfig.providerConfig);
      setIsLoading(true);
      setLoadingMessage("Generating your adventure…");

      const storyData = await provider.generateFullStory(
        gameConfig.rounds,
        gameConfig.choicesPerRound,
        sessionSeed
      );

      if (!storyData || !storyData.rounds || storyData.rounds.length === 0) {
        throw new Error("Failed to generate story data");
      }

      setAllRounds(storyData.rounds);
      setCurrentRoundData(storyData.rounds[0]);

      setGameState({
        status: "playing",
        currentRound: 1,
        narrativeState:
          storyData.rounds[0].narrative_state ||
          defaultGameState.narrativeState,
        choiceHistory: [],
        intro: storyData.intro,
      });
    } catch (error) {
      toast.error("Failed to start game: " + (error as Error).message);
      console.error("Start game error:", error);
    } finally {
      setIsLoading(false);
      setLoadingMessage(undefined);
    }
  }, [gameConfig, sessionSeed]);

  const makeChoice = useCallback(
    async (choice: Choice) => {
      if (!allRounds) return;

      const newHistory = [...gameState.choiceHistory, choice];

      if (!choice.is_correct) {
        setGameState((prev) => ({
          ...prev,
          status: "failure",
          failureReason: choice.consequence,
          choiceHistory: newHistory,
        }));
        return;
      }

      if (gameState.currentRound >= gameConfig.rounds) {
        setGameState((prev) => ({
          ...prev,
          status: "victory",
          choiceHistory: newHistory,
        }));
        return;
      }

      const nextRoundIndex = gameState.currentRound;
      if (nextRoundIndex < allRounds.length) {
        const nextRound = allRounds[nextRoundIndex];
        setCurrentRoundData(nextRound);
        setGameState((prev) => ({
          ...prev,
          currentRound: prev.currentRound + 1,
          narrativeState: nextRound.narrative_state || prev.narrativeState,
          choiceHistory: newHistory,
        }));
      }
    },
    [allRounds, gameState, gameConfig]
  );

  const resetGame = useCallback(() => {
    setGameState(defaultGameState);
    setAllRounds(null);
    setCurrentRoundData(null);
  }, []);

  const value = {
    gameConfig,
    gameState,
    sessionSeed,
    allRounds,
    currentRoundData,
    isLoading,
    loadingMessage,
  };

  console.log("value", value);

  return (
    <GameContext.Provider
      value={{
        ...value,
        updateConfig,
        startGame,
        makeChoice,
        resetGame,
        testConnection,
        testConnectionWith,
      }}
    >
      {isLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-[var(--background)] pixel-border pixel-shadow px-6 py-5 text-center">
            <div className="font-pixel text-[var(--primary)] mb-3">
              LOADING…
            </div>
            <div className="flex gap-1 justify-center mb-2">
              <span className="w-3 h-3 bg-[var(--primary)] animate-bounce [animation-delay:-0.2s]"></span>
              <span className="w-3 h-3 bg-[var(--primary)]/80 animate-bounce [animation-delay:-0.1s]"></span>
              <span className="w-3 h-3 bg-[var(--primary)]/60 animate-bounce"></span>
            </div>
            {loadingMessage && (
              <div className="font-retro text-sm text-[var(--muted-foreground)]">
                {loadingMessage}
              </div>
            )}
          </div>
        </div>
      )}
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
