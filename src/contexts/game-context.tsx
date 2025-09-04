"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { logger } from "@/lib/logger";
import {
  IGameState,
  IChoice,
  IGameRound,
  ISettings,
  IProviderConfig,
} from "@/types/game";
import { ProviderFactory } from "@/lib/providers/provider-factory";
import { toast } from "sonner";
import { providerData } from "@/components/home/constants";

interface GameContextType {
  apiKey?: string;
  settings: ISettings;
  gameState: IGameState;
  allRounds: IGameRound[] | null;
  currentRoundData: IGameRound | null;
  isLoading: boolean;
  loadingMessage?: string;
  isLoadingSettings: boolean;
  // Actions
  updateSettings: (settings: ISettings) => void;
  startGame: () => Promise<void>;
  makeChoice: (choice: IChoice) => Promise<void>;
  resetGame: () => void;
  testConnection: () => Promise<void>;
}

const defaultSettings: ISettings = {
  gameConfig: {
    rounds: 2,
    choicesPerRound: 2,
    contentLanguage: "English",
  },
  providerConfig: {
    provider: "openai",
  },
};

const defaultGameState: IGameState = {
  status: "idle",
  currentRound: 0,
  narrativeState: {
    location: "Unknown",
    status: "Ready",
    initItems: [],
  },
  choiceHistory: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ISettings>(defaultSettings);
  const [gameState, setGameState] = useState<IGameState>(defaultGameState);
  const [allRounds, setAllRounds] = useState<IGameRound[] | null>(null);
  const [currentRoundData, setCurrentRoundData] = useState<IGameRound | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(
    undefined
  );

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoadingSettings(true);

        const savedSettings = localStorage.getItem("jadeCompassSettings");
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);

          const provider = parsed.providerConfig?.provider || "openai";
          const defaults =
            providerData?.[provider as keyof typeof providerData];
          // Apply saved settings to game config immediately
          const newSettings: ISettings = {
            gameConfig: {
              rounds: parsed.gameConfig?.rounds || 2,
              choicesPerRound: parsed.gameConfig?.choicesPerRound || 2,
              contentLanguage: parsed.gameConfig?.contentLanguage || "English",
            },
            providerConfig: {
              provider,
              apiBase: defaults?.apiBase,
              model: parsed.providerConfig?.model || defaults?.defaultModel,
              customModel: parsed.providerConfig?.customModel || "",
              apiKeyManager: parsed.providerConfig?.apiKeyManager || {},
            },
          };

          setSettings(newSettings);
        } else {
          // If no saved settings, initialize with defaults and save them
          const defaultSettings: ISettings = {
            gameConfig: {
              rounds: 2,
              choicesPerRound: 2,
              contentLanguage: "English",
            },
            providerConfig: {
              provider: "openai",
              model: providerData?.openai?.defaultModel,
              customModel: "",
            },
          };

          setSettings(defaultSettings);
          localStorage.setItem(
            "jadeCompassSettings",
            JSON.stringify(defaultSettings)
          );
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (
      allRounds &&
      gameState.currentRound > 0 &&
      gameState.currentRound <= allRounds.length
    ) {
      setCurrentRoundData(allRounds[gameState.currentRound - 1]);
    }
  }, [gameState.currentRound, allRounds]);

  const updateSettings = useCallback((newSettings: ISettings) => {
    setSettings((prev) => {
      const updated: ISettings = {
        ...prev,
        gameConfig: {
          ...prev.gameConfig,
          ...newSettings.gameConfig,
        },
        providerConfig: {
          ...prev.providerConfig,
          ...newSettings.providerConfig,
        } as IProviderConfig,
      };

      // Save to localStorage
      localStorage.setItem(
        "jadeCompassSettings",
        JSON.stringify({
          ...updated,
          providerConfig: {
            ...updated.providerConfig,
            apiKeyManager: undefined,
          },
        })
      );

      return updated;
    });
  }, []);

  const testConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      const { providerConfig } = settings;
      if (!providerConfig) {
        throw new Error("Provider configuration is required");
      }
      console.log("providerConfig :", providerConfig);
      const provider = ProviderFactory.create(providerConfig);
      await provider.testConnection();

      toast.success("Connection test completed");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`${errorMessage}`);
      logger.error("Test connection error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  const startGame = useCallback(async () => {
    try {
      const { providerConfig, gameConfig } = settings;
      if (!providerConfig) {
        throw new Error("Provider configuration is required");
      }
      const provider = ProviderFactory.create(providerConfig);
      setIsLoading(true);
      setLoadingMessage("Generating your adventure…");

      const rounds = gameConfig?.rounds || 2;
      const choicesPerRound = gameConfig?.choicesPerRound || 2;

      const storyData = await provider.generateFullStory(
        rounds,
        choicesPerRound,
        gameConfig?.contentLanguage || "English",
        provider.generateRequestId()
      );

      if (!storyData || !storyData.rounds || storyData.rounds.length === 0) {
        throw new Error("Failed to generate story data");
      }

      setAllRounds(storyData.rounds);
      setCurrentRoundData(storyData.rounds[0]);

      setGameState({
        status: "playing",
        currentRound: 1,
        narrativeState: storyData.rounds[0].narrativeState,
        choiceHistory: [],
        intro: storyData.intro,
        overallTheme: storyData.overallTheme,
      });
    } catch (error) {
      toast.error("Failed to start game: " + (error as Error).message);
      logger.error("Start game error:", error);
    } finally {
      setIsLoading(false);
      setLoadingMessage(undefined);
    }
  }, [settings]);

  const makeChoice = useCallback(
    async (choice: IChoice) => {
      if (!allRounds) return;

      if (!choice.isCorrect) {
        setGameState((prev: IGameState) => ({
          ...prev,
          status: "failure",
          failureReason: choice.consequence,
          choiceHistory: [...prev.choiceHistory, choice],
        }));
        return;
      }

      if (gameState.currentRound >= (settings.gameConfig?.rounds || 2)) {
        setGameState((prev: IGameState) => ({
          ...prev,
          status: "victory",
          choiceHistory: [...prev.choiceHistory, choice],
        }));
        return;
      }

      const nextRoundIndex = gameState.currentRound;
      if (nextRoundIndex < allRounds.length) {
        const nextRound = allRounds[nextRoundIndex];
        setCurrentRoundData(nextRound);
        setGameState((prev: IGameState) => ({
          ...prev,
          currentRound: prev.currentRound + 1,
          narrativeState: nextRound.narrativeState || prev.narrativeState,
          choiceHistory: [...prev.choiceHistory, choice],
        }));
      }
    },
    [allRounds, gameState, settings.gameConfig]
  );

  const resetGame = useCallback(() => {
    setGameState(defaultGameState);
    setAllRounds(null);
    setCurrentRoundData(null);
  }, []);

  const apiKey = React.useMemo(
    () =>
      settings.providerConfig?.apiKeyManager?.[
        settings.providerConfig?.provider || "openai"
      ],
    [settings.providerConfig?.provider, settings.providerConfig?.apiKeyManager]
  );
  const values = React.useMemo(
    () => ({
      apiKey,
      settings,
      gameState,
      allRounds,
      currentRoundData,
      isLoading,
      loadingMessage,
      isLoadingSettings,
    }),
    [
      apiKey,
      settings,
      gameState,
      allRounds,
      currentRoundData,
      isLoading,
      loadingMessage,
      isLoadingSettings,
    ]
  );

  const methods = React.useMemo(
    () => ({
      startGame,
      makeChoice,
      resetGame,
      updateSettings,
      testConnection,
    }),
    [startGame, makeChoice, resetGame, updateSettings, testConnection]
  );

  logger.debug("GameContext initialized", {
    gameState,
    allRounds: Boolean(allRounds),
    settings: {
      ...settings,
      providerConfig: {
        ...settings.providerConfig,
        apiKeyManager: undefined,
      },
    },
  });

  return (
    <GameContext.Provider
      value={{
        ...values,
        ...methods,
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
              <div className="font-retro text-base text-[var(--muted-foreground)]">
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
