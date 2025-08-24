import { LLMProvider, IProviderConfig } from "@/types/game";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";
import { GoogleProvider } from "./google";
import { VercelAIProvider } from "./vercel";
import { providerData } from "@/components/home";
import { MistralProvider } from "./mistral";

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

      case "google":
        if (!apiKey) {
          throw new Error("API key is required for Google");
        }
        return new GoogleProvider(
          apiKey,
          "Google",
          providerData.google.apiBase,
          effectiveModel || providerData.google.defaultModel
        );

      case "mistral":
        if (!apiKey) {
          throw new Error("API key is required for Mistral");
        }
        return new MistralProvider(
          apiKey,
          "Mistral",
          providerData.mistral.apiBase,
          effectiveModel || providerData.mistral.defaultModel
        );

      case "anthropic-ai-sdk":
        if (!apiKey) {
          throw new Error("API key is required for Anthropic AI SDK");
        }
        return new VercelAIProvider(
          apiKey,
          providerInfo.name,
          providerInfo.apiBase,
          effectiveModel || providerInfo.defaultModel,
          provider
        );

      case "google-ai-sdk":
        if (!apiKey) {
          throw new Error("API key is required for Google AI SDK");
        }
        return new VercelAIProvider(
          apiKey,
          providerInfo.name,
          providerInfo.apiBase,
          effectiveModel || providerInfo.defaultModel,
          provider
        );

      case "groq-ai-sdk":
        if (!apiKey) {
          throw new Error("API key is required for Groq AI SDK");
        }
        return new VercelAIProvider(
          apiKey,
          providerInfo.name,
          providerInfo.apiBase,
          effectiveModel || providerInfo.defaultModel,
          provider
        );

      case "mistral-ai-sdk":
        if (!apiKey) {
          throw new Error("API key is required for Mistral AI SDK");
        }
        return new VercelAIProvider(
          apiKey,
          providerInfo.name,
          providerInfo.apiBase,
          effectiveModel || providerInfo.defaultModel,
          provider
        );

      case "openrouter-ai-sdk":
        if (!apiKey) {
          throw new Error("API key is required for OpenRouter AI SDK");
        }
        return new VercelAIProvider(
          apiKey,
          providerInfo.name,
          providerInfo.apiBase,
          effectiveModel || providerInfo.defaultModel,
          provider
        );
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
