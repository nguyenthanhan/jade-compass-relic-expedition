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
import * as LucideIcons from "lucide-react";
const {
  Settings,
  X,
  Save,
  TestTube,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronDown,
  CircleX,
} = LucideIcons;
import { toast } from "sonner";
import { ISettings } from "@/types/game";

const DEFAULT_OPENROUTER_MODEL = "deepseek/deepseek-chat-v3-0324:free";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

// Model suggestions for each provider
const OPENROUTER_MODELS = [
  {
    value: "deepseek/deepseek-chat-v3-0324:free",
  },
  {
    value: "deepseek/deepseek-r1-0528:free",
  },
  {
    value: "moonshotai/kimi-k2:free",
  },
  {
    value: "qwen/qwen3-235b-a22b:free",
  },
  {
    value: "google/gemini-2.0-flash-exp:free",
  },
  {
    value: "microsoft/mai-ds-r1:free",
  },
  {
    value: "meta-llama/llama-3.3-70b-instruct:free",
  },
  {
    value: "openai/gpt-oss-20b:free",
  },
  {
    value: "qwen/qwen3-14b:free",
  },
  {
    value: "mistralai/mistral-small-3.2-24b-instruct:free",
  },
  {
    value: "mistralai/mistral-nemo:free",
  },
  {
    value: "mistralai/mistral-small-3.1-24b-instruct:free",
  },
  {
    value: "google/gemma-3-27b-it:free",
  },
  {
    value: "z-ai/glm-4.5-air:free",
  },
];

const GEMINI_MODELS = [
  {
    value: "gemini-2.5-flash",
  },
  {
    value: "gemini-2.5-pro",
  },
  {
    value: "gemini-2.0-flash",
  },
];

// Settings Modal Component
function SettingsModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: ISettings) => void;
}) {
  // Load settings from localStorage on mount
  const [provider, setProvider] = useState<ISettings["provider"]>("openrouter");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [savedKeys, setSavedKeys] = useState<{ [key: string]: string }>({});
  const [selectedKeyName, setSelectedKeyName] = useState("");
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const { testConnectionWith, updateConfig } = useGame();

  useEffect(() => {
    // Load settings from localStorage when modal opens
    if (isOpen) {
      const savedSettings = localStorage.getItem("jadeCompassSettings");
      const savedApiKeys = localStorage.getItem("jadeCompassApiKeys");

      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setProvider(parsed.provider || "openrouter");
          setApiKey(parsed.apiKey || "");
          setModel(parsed.model || "");
          setSelectedKeyName(parsed.selectedKeyName || "");
        } catch (e) {
          console.error("Failed to load settings:", e);
        }
      }

      if (savedApiKeys) {
        try {
          const parsedKeys = JSON.parse(savedApiKeys);
          setSavedKeys(parsedKeys);
        } catch (e) {
          console.error("Failed to load API keys:", e);
        }
      }
    }
  }, [isOpen]);

  // Handle provider change
  const handleProviderChange = (newProvider: "openrouter" | "gemini") => {
    setProvider(newProvider);
    // Set default model when provider changes
    setModel(
      newProvider === "openrouter"
        ? DEFAULT_OPENROUTER_MODEL
        : DEFAULT_GEMINI_MODEL
    );
  };

  // Auto-select default model when modal opens
  useEffect(() => {
    if (!isOpen || model) return;
    setModel(
      provider === "openrouter"
        ? DEFAULT_OPENROUTER_MODEL
        : DEFAULT_GEMINI_MODEL
    );
  }, [isOpen]);

  const handleSaveKey = () => {
    if (!keyName.trim() || !apiKey.trim()) {
      toast.error("Please enter both key name and API key");
      return;
    }

    const updatedKeys = { ...savedKeys, [keyName]: apiKey };
    setSavedKeys(updatedKeys);
    localStorage.setItem("jadeCompassApiKeys", JSON.stringify(updatedKeys));

    setSelectedKeyName(keyName);
    setKeyName("");
    setShowNewKeyForm(false);
    toast.success(`API key "${keyName}" saved!`);
  };

  const handleSelectKey = (keyName: string) => {
    setSelectedKeyName(keyName);
    setApiKey(savedKeys[keyName] || "");
  };

  const handleDeleteKey = (keyName: string) => {
    const updatedKeys = { ...savedKeys };
    delete updatedKeys[keyName];
    setSavedKeys(updatedKeys);
    localStorage.setItem("jadeCompassApiKeys", JSON.stringify(updatedKeys));

    if (selectedKeyName === keyName) {
      setSelectedKeyName("");
      setApiKey("");
    }
    toast.success(`API key "${keyName}" deleted!`);
  };

  const handleSave = () => {
    const settings = {
      provider,
      apiKey: apiKey,
      model: model,
      selectedKeyName,
    };

    // Save to localStorage
    localStorage.setItem("jadeCompassSettings", JSON.stringify(settings));

    // Update the game configuration with the new provider and model
    updateConfig({
      providerConfig: {
        provider,
        apiKey: apiKey,
        model: model,
      },
    });

    // Pass to parent
    onSave(settings);
    onClose();
  };

  const handleTestConnection = async () => {
    if (apiKey) {
      const testConfig = {
        provider,
        apiKey,
        model:
          model ||
          (provider === "openrouter"
            ? DEFAULT_OPENROUTER_MODEL
            : DEFAULT_GEMINI_MODEL),
      };

      // Update config for future use
      updateConfig({ providerConfig: testConfig });

      // Use global test with loading overlay
      return await testConnectionWith(testConfig);
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
          <div className="p-6 space-y-0">
            <div>
              <label className="font-pixel text-sm mb-2 block text-[var(--primary)]">
                Content Provider
              </label>
              <div className="relative">
                <select
                  className="w-full p-2 pr-12 appearance-none font-retro bg-[var(--background)] border-2 border-[var(--input)] pixel-shadow"
                  value={provider}
                  onChange={(e) =>
                    handleProviderChange(
                      e.target.value as "openrouter" | "gemini"
                    )
                  }
                >
                  <option value="openrouter">🤖 OpenRouter</option>
                  <option value="gemini">✨ Google Gemini</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              </div>
            </div>

            <>
              <div className="p-3 bg-[var(--accent)]/10 rounded pixel-border-sm">
                <p className="font-retro text-sm">
                  💡{" "}
                  {provider === "openrouter"
                    ? "Get FREE API key at: openrouter.ai/keys"
                    : "Get FREE API key at: aistudio.google.com/app/apikey"}
                </p>
              </div>

              <div>
                <label className="font-pixel text-sm mb-2 block text-[var(--primary)]">
                  API Key Management
                </label>

                {/* Saved Keys Dropdown */}
                {Object.keys(savedKeys).length > 0 && (
                  <div className="mb-3">
                    <label className="font-retro text-xs mb-1 block text-[var(--muted-foreground)]">
                      Select Saved Key:
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select
                          className="w-full p-2 pr-12 appearance-none font-retro bg-[var(--background)] border-2 border-[var(--input)] pixel-shadow text-sm"
                          value={selectedKeyName}
                          onChange={(e) => handleSelectKey(e.target.value)}
                        >
                          <option value="">Choose a saved key...</option>
                          {Object.keys(savedKeys).map((keyName) => (
                            <option key={keyName} value={keyName}>
                              {keyName}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                      </div>
                      {selectedKeyName && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteKey(selectedKeyName)}
                          className="px-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Current API Key Display/Input */}
                <div className="mb-3">
                  <label className="font-retro text-xs mb-1 block text-[var(--muted-foreground)]">
                    Current API Key:
                  </label>
                  <div className="relative">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter or paste your API key here"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="font-mono pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Add New Key Form */}
                {showNewKeyForm ? (
                  <div className="p-3 bg-[var(--muted)]/10 pixel-border mb-3">
                    <label className="font-retro text-xs mb-1 block text-[var(--muted-foreground)]">
                      Save current key as:
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter key name (e.g., 'My OpenRouter Key')"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        className="flex-1 text-sm"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSaveKey}
                        disabled={!keyName.trim() || !apiKey.trim()}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowNewKeyForm(false);
                          setKeyName("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  apiKey && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewKeyForm(true)}
                      className="mb-3"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Save this key
                    </Button>
                  )
                )}

                <p className="font-retro text-xs text-[var(--muted-foreground)]">
                  🔒 Keys are saved locally in your browser only
                </p>
              </div>

              <div>
                <label className="font-pixel text-sm mb-2 block">
                  Model (Optional)
                </label>
                <div className="relative">
                  <select
                    className="w-full p-2 pr-12 appearance-none font-retro bg-[var(--background)] border-2 border-[var(--input)] pixel-shadow mb-2"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  >
                    {(provider === "openrouter"
                      ? OPENROUTER_MODELS
                      : GEMINI_MODELS
                    ).map((modelOption) => (
                      <option key={modelOption.value} value={modelOption.value}>
                        {modelOption.value}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                </div>
                <Input
                  type="text"
                  placeholder="Or enter custom model name"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="font-mono text-sm mt-2"
                />
              </div>
            </>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-2 p-4 border-t-2 border-[var(--border)]">
            <Button variant="destructive" className="flex-1" onClick={onClose}>
              <CircleX className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            {model && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleTestConnection}
                disabled={!apiKey}
              >
                <TestTube className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
            )}
            <Button className="flex-1" onClick={handleSave} disabled={!apiKey}>
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
  const [currentSettings, setCurrentSettings] = useState<ISettings | null>(
    null
  );

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("jadeCompassSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setCurrentSettings(parsed);

        // Apply saved settings to game config immediately
        const providerConfig = {
          provider: parsed.provider as "openrouter" | "gemini",
          apiKey: parsed.apiKey,
          model:
            parsed.model ||
            (parsed.provider === "openrouter"
              ? DEFAULT_OPENROUTER_MODEL
              : DEFAULT_GEMINI_MODEL),
        };

        updateConfig({ providerConfig });
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
  }, [updateConfig]);

  const handleStartGame = async () => {
    if (!currentSettings || !currentSettings.apiKey) {
      toast.error("Please configure your API settings first");
      setShowSettings(true);
      return;
    }

    const providerConfig = {
      provider: currentSettings.provider as "openrouter" | "gemini",
      apiKey: currentSettings.apiKey,
      model:
        currentSettings.model ||
        (currentSettings.provider === "openrouter"
          ? DEFAULT_OPENROUTER_MODEL
          : DEFAULT_GEMINI_MODEL),
    };

    updateConfig({ providerConfig });
    await new Promise((resolve) => setTimeout(resolve, 100));
    await startGame();
  };

  const handleSaveSettings = (settings: ISettings) => {
    setCurrentSettings(settings);
  };

  // Determine button text based on current settings
  const getStartButtonText = () => {
    if (!currentSettings) {
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
    if (!currentSettings) return true;
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
            <p className="font-pixel text-lg text-[var(--accent)]">
              Relic Expedition
            </p>
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
                <div className="grid grid-cols-2 gap-4">
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
                      className="w-full"
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
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Current Settings Display */}
              {currentSettings && (
                <div className="p-3 bg-[var(--muted)]/20 pixel-border-sm">
                  <p className="font-retro text-sm">
                    <span className="text-[var(--muted-foreground)]">
                      Mode:
                    </span>{" "}
                    <span className="text-[var(--primary)]">
                      {currentSettings.provider === "openrouter"
                        ? `OpenRouter AI (${
                            currentSettings.model || "default"
                          })`
                        : currentSettings.provider === "gemini"
                        ? `Google Gemini AI (${
                            currentSettings.model || "default"
                          })`
                        : "Offline"}
                    </span>
                    {currentSettings.apiKey && (
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
