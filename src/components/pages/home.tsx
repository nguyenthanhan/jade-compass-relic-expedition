"use client";

import React, { useState, useEffect } from "react";
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
import { Settings, X, Save, TestTube } from "lucide-react";

const DEFAULT_OPENROUTER_MODEL = "deepseek/deepseek-chat-v3-0324:free";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

// Settings Modal Component
function SettingsModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
}) {
  // Load settings from localStorage on mount
  const [provider, setProvider] = useState<"offline" | "openrouter" | "gemini">(
    "offline"
  );
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const { testConnection, updateConfig } = useGame();

  useEffect(() => {
    // Load settings from localStorage when modal opens
    if (isOpen) {
      const savedSettings = localStorage.getItem("jadeCompassSettings");
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setProvider(parsed.provider || "offline");
          setApiKey(parsed.apiKey || "");
          setModel(parsed.model || "");
        } catch (e) {
          console.error("Failed to load settings:", e);
        }
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    const settings = {
      provider,
      apiKey: provider !== "offline" ? apiKey : "",
      model: provider !== "offline" ? model : "",
    };

    // Save to localStorage
    localStorage.setItem("jadeCompassSettings", JSON.stringify(settings));

    // Pass to parent
    onSave(settings);
    onClose();
  };

  const handleTestConnection = async () => {
    if (provider !== "offline" && apiKey) {
      updateConfig({
        providerConfig: {
          provider,
          apiKey,
          model:
            model ||
            (provider === "openrouter"
              ? DEFAULT_OPENROUTER_MODEL
              : DEFAULT_GEMINI_MODEL),
        },
      });
      await testConnection();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[var(--background)] pixel-border pixel-shadow max-w-lg w-full max-h-[90vh] overflow-auto animate-in zoom-in-95 duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-[var(--border)]">
            <h2 className="font-pixel text-lg text-[var(--primary)]">
              Settings
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-4">
            <div>
              <label className="font-pixel text-sm mb-2 block text-[var(--primary)]">
                Content Provider
              </label>
              <select
                className="w-full p-2 font-retro bg-[var(--background)] border-2 border-[var(--input)] pixel-shadow"
                value={provider}
                onChange={(e) =>
                  setProvider(
                    e.target.value as "offline" | "openrouter" | "gemini"
                  )
                }
              >
                <option value="offline">🎮 Offline (No API needed)</option>
                <option value="openrouter">🤖 OpenRouter (AI Generated)</option>
                <option value="gemini">✨ Google Gemini (AI Generated)</option>
              </select>
            </div>

            {provider !== "offline" && (
              <>
                <div className="p-3 bg-[var(--accent)]/10 rounded pixel-border">
                  <p className="font-retro text-sm">
                    💡{" "}
                    {provider === "openrouter"
                      ? "Get FREE API key at: openrouter.ai/keys"
                      : "Get FREE API key at: makersuite.google.com/app/apikey"}
                  </p>
                </div>

                <div>
                  <label className="font-pixel text-sm mb-2 block text-[var(--primary)]">
                    API Key
                  </label>
                  <Input
                    type="password"
                    placeholder="Paste your API key here"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono"
                  />
                  <p className="font-retro text-xs mt-1 text-[var(--muted-foreground)]">
                    🔒 Key is saved locally in your browser only
                  </p>
                </div>

                <div>
                  <label className="font-pixel text-sm mb-2 block">
                    Model (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder={
                      provider === "openrouter"
                        ? "Default: " + DEFAULT_OPENROUTER_MODEL
                        : "Default: " + DEFAULT_GEMINI_MODEL
                    }
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleTestConnection}
                  disabled={!apiKey}
                >
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
              </>
            )}

            {provider === "offline" && (
              <div className="p-3 bg-[var(--primary)]/10 rounded pixel-border">
                <p className="font-retro text-sm">
                  ✅ Offline mode uses pre-written adventures. No API or
                  internet needed!
                </p>
                <p className="font-retro text-xs mt-2 text-[var(--muted-foreground)]">
                  Perfect for playing without any setup or API keys.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex gap-2 p-4 border-t-2 border-[var(--border)]">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={provider !== "offline" && !apiKey}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export function HomePage() {
  const { gameConfig, updateConfig, startGame } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<any>(null);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("jadeCompassSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setCurrentSettings(parsed);
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
  }, []);

  const handleStartGame = async () => {
    // Use saved settings or default to offline
    const settings = currentSettings || { provider: "offline" };

    if (settings.provider !== "offline" && settings.apiKey) {
      updateConfig({
        providerConfig: {
          provider: settings.provider,
          apiKey: settings.apiKey,
          model:
            settings.model ||
            (settings.provider === "openrouter"
              ? DEFAULT_OPENROUTER_MODEL
              : DEFAULT_GEMINI_MODEL),
        },
      });
    } else {
      updateConfig({
        providerConfig: {
          provider: "offline",
        },
      });
    }

    await startGame();
  };

  const handleSaveSettings = (settings: any) => {
    setCurrentSettings(settings);
  };

  // Determine button text based on current settings
  const getStartButtonText = () => {
    if (!currentSettings || currentSettings.provider === "offline") {
      return "🎮 START ADVENTURE (Offline Mode)";
    }
    if (currentSettings.apiKey) {
      return `🚀 START ADVENTURE (${
        currentSettings.provider === "openrouter" ? "OpenRouter" : "Gemini"
      })`;
    }
    return "⚠️ Configure AI Settings First";
  };

  const canStart = () => {
    if (!currentSettings || currentSettings.provider === "offline") return true;
    return !!currentSettings.apiKey;
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="font-pixel text-3xl text-[var(--primary)] float">
              JADE COMPASS
            </h1>
            <p className="font-pixel text-lg text-[var(--accent)]">Relic Run</p>
            <p className="font-retro text-2xl text-[var(--muted-foreground)]">
              A treasure hunting adventure awaits...
            </p>
          </div>

          {/* Main Card */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>New Adventure</CardTitle>
              <CardDescription>Configure your treasure hunt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Game Settings */}
              <div className="space-y-4">
                <div>
                  <label className="font-pixel text-sm mb-2 block">
                    Rounds (2-10)
                  </label>
                  <Input
                    type="number"
                    min="2"
                    max="10"
                    value={gameConfig.rounds}
                    onChange={(e) =>
                      updateConfig({ rounds: parseInt(e.target.value) || 5 })
                    }
                  />
                </div>
                <div>
                  <label className="font-pixel text-sm mb-2 block">
                    Choices per Round (2-5)
                  </label>
                  <Input
                    type="number"
                    min="2"
                    max="5"
                    value={gameConfig.choicesPerRound}
                    onChange={(e) =>
                      updateConfig({
                        choicesPerRound: parseInt(e.target.value) || 3,
                      })
                    }
                  />
                </div>
              </div>

              {/* Current Settings Display */}
              {currentSettings && (
                <div className="p-3 bg-[var(--muted)]/20 pixel-border">
                  <p className="font-retro text-sm">
                    <span className="text-[var(--muted-foreground)]">
                      Mode:
                    </span>{" "}
                    <span className="text-[var(--primary)]">
                      {currentSettings.provider === "offline"
                        ? "Offline"
                        : currentSettings.provider === "openrouter"
                        ? "OpenRouter AI"
                        : "Google Gemini AI"}
                    </span>
                    {currentSettings.provider !== "offline" &&
                      currentSettings.apiKey && (
                        <span className="text-[var(--accent)]">
                          {" "}
                          ✓ Configured
                        </span>
                      )}
                  </p>
                </div>
              )}

              {/* Settings Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>

              {/* Start Button */}
              <Button
                className="w-full text-lg pulse"
                onClick={handleStartGame}
                disabled={!canStart()}
              >
                {getStartButtonText()}
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardContent className="pt-4">
              <p className="font-retro text-sm text-[var(--muted-foreground)]">
                Choose wisely, adventurer. Only one path leads to the treasure.
                Wrong choices end your journey. Navigate through all rounds to
                claim the legendary Jade Compass!
              </p>
              <p className="font-retro text-xs text-[var(--accent)] mt-2">
                💡 Tip: Use number keys 1-5 for quick selection during gameplay.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
      />
    </>
  );
}
export default HomePage;
