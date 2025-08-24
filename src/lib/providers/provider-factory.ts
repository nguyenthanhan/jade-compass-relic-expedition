import { LLMProvider, IProviderConfig } from "@/types/game";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";
import { GeminiProvider } from "./gemini";
import { providerData } from "@/components/home";

export class ProviderFactory {
  static create(config: IProviderConfig): LLMProvider {
    const provider = config.provider ?? "openai";
    const apiKey = config.apiKeyManager?.[provider];
    const providerInfo = (providerData as any)[provider];
    const effectiveModel =
      config.model === "__custom__" && config.customModel
        ? config.customModel
        : config.model ?? providerInfo?.defaultModel;

    switch (provider) {
      case "openai":
        if (!apiKey) {
          throw new Error("API key is required for OpenAI");
        }
        return new OpenAIProvider(
          apiKey,
          "OpenAI",
          providerData.openai.apiBase,
          effectiveModel || providerData.openai.defaultModel
        );

      // Using OpenAIProvider for OpenRouter
      case "openrouter":
        if (!apiKey) {
          throw new Error("API key is required for OpenRouter");
        }
        return new OpenAIProvider(
          apiKey,
          "OpenRouter",
          providerData.openrouter.apiBase,
          effectiveModel || providerData.openrouter.defaultModel
        );

      case "anthropic":
        if (!apiKey) {
          throw new Error("API key is required for Anthropic");
        }
        return new AnthropicProvider(
          apiKey,
          "Anthropic",
          providerData.anthropic.apiBase,
          effectiveModel || providerData.anthropic.defaultModel
        );

      case "gemini":
        if (!apiKey) {
          throw new Error("API key is required for Gemini");
        }
        return new GeminiProvider(
          apiKey,
          "Google Gemini",
          providerData.gemini.apiBase,
          effectiveModel || providerData.gemini.defaultModel
        );

      default:
        throw new Error(`Unknown provider: ${String(provider)}`);
    }
  }
}
