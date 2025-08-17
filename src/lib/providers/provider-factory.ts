import { LLMProvider, ProviderConfig } from "@/types/game";
import { OpenRouterProvider } from "./openrouter-provider";
import { GeminiProvider } from "./gemini-provider";

export class ProviderFactory {
  static create(config: ProviderConfig): LLMProvider {
    switch (config.provider) {
      case "openrouter":
        if (!config.apiKey) {
          throw new Error("API key is required for OpenRouter");
        }
        return new OpenRouterProvider(config.apiKey, config.model);

      case "gemini":
        if (!config.apiKey) {
          throw new Error("API key is required for Gemini");
        }
        return new GeminiProvider(config.apiKey, config.model);

      default:
        throw new Error(`Unknown provider: ${config.provider}`);
    }
  }
}
