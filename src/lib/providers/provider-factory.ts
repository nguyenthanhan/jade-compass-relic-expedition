import { LLMProvider, IProviderConfig } from "@/types/game";
import { OpenAIProvider } from "./openai";
import { OpenRouterProvider } from "./openrouter";
import { AnthropicProvider } from "./anthropic";
import { GeminiProvider } from "./gemini";
import { providerData } from "@/components/home";

export class ProviderFactory {
  static create(config: IProviderConfig): LLMProvider {
    const apiKey = config.apiKeyManager?.[config.provider || "openai"];
    switch (config.provider) {
      case "openai":
        if (!apiKey) {
          throw new Error("API key is required for OpenAI");
        }
        return new OpenAIProvider(
          apiKey,
          "OpenAI",
          providerData.openai.apiBase,
          config.model || providerData.openai.defaultModel
        );

      case "openrouter":
        if (!apiKey) {
          throw new Error("API key is required for OpenRouter");
        }
        return new OpenAIProvider(
          apiKey,
          "OpenRouter",
          providerData.openrouter.apiBase,
          config.model || providerData.openrouter.defaultModel
        );

      case "anthropic":
        if (!apiKey) {
          throw new Error("API key is required for Anthropic");
        }
        return new AnthropicProvider(
          apiKey,
          "Anthropic",
          providerData.anthropic.apiBase,
          config.model || providerData.anthropic.defaultModel
        );

      case "gemini":
        if (!apiKey) {
          throw new Error("API key is required for Gemini");
        }
        return new GeminiProvider(
          apiKey,
          "Google Gemini",
          providerData.gemini.apiBase,
          config.model || providerData.gemini.defaultModel
        );

      default:
        throw new Error(`Unknown provider: ${config.provider}`);
    }
  }
}
