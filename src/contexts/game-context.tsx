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
  NarrativeState,
  LLMProvider,
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
  updateConfig: (config: Partial<GameConfig>) => void;
  startGame: () => Promise<void>;
  makeChoice: (choice: Choice) => Promise<void>;
  resetGame: () => void;
  testConnection: () => Promise<boolean>;
}

const defaultConfig: GameConfig = {
  rounds: 2,
  choicesPerRound: 2,
  providerConfig: {
    provider: "gemini",
    apiKey: "",
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

  const testConnection = useCallback(async () => {
    try {
      const testProvider = ProviderFactory.create(gameConfig.providerConfig);
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
    }
  }, [gameConfig.providerConfig]);

  const startGame = useCallback(async () => {
    try {
      const provider = ProviderFactory.create(gameConfig.providerConfig);
      
      toast.info("Generating your complete adventure...", { duration: 3000 });

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
      
      toast.success("Adventure generated successfully!");
    } catch (error) {
      toast.error("Failed to start game: " + (error as Error).message);
      console.error("Start game error:", error);
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

  return (
    <GameContext.Provider
      value={{
        gameConfig,
        gameState,
        sessionSeed,
        allRounds,
        currentRoundData,
        updateConfig,
        startGame,
        makeChoice,
        resetGame,
        testConnection,
      }}
    >
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
