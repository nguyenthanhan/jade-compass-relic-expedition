import { createOpenAI, OpenAIProvider } from "@ai-sdk/openai";
import { createAnthropic, AnthropicProvider } from "@ai-sdk/anthropic";
import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProvider,
} from "@ai-sdk/google";
import { createGroq, GroqProvider } from "@ai-sdk/groq";
import { createMistral, MistralProvider } from "@ai-sdk/mistral";
import {
  createOpenRouter,
  LanguageModelV2,
  OpenRouterProvider,
} from "@openrouter/ai-sdk-provider";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import {
  ContentLanguageType,
  IFullStoryResponse,
  AISDKProviderType,
} from "@/types/game";
import { BaseLLMProvider } from "./base";
import { parseToFullStoryResponse } from "@/utils/response-parser";
import { parseJSONResponse } from "@/utils/string";

// Define the schema for the story response
const FullStorySchema = z.object({
  intro: z.string(),
  overallTheme: z.string(),
  rounds: z.array(
    z.object({
      intro: z.string(),
      round: z.number(),
      location: z.string(),
      narrativeState: z.object({
        location: z.string(),
        status: z.string(),
        initItems: z.array(z.string()),
        storyProgress: z.string().optional(),
      }),
      choices: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          summary: z.string(),
          isCorrect: z.boolean(),
          consequence: z.string(),
          finalItems: z.array(z.string()),
        })
      ),
      failureSummary: z.string().optional(),
    })
  ),
});

export class VercelAIProvider extends BaseLLMProvider {
  name: string;
  protected apiKey: string;
  protected apiBase: string;
  protected model: string;
  private aiProvider: AISDKProviderType;
  private client: any;

  private openai: OpenAIProvider;
  private anthropic: AnthropicProvider;
  private google: GoogleGenerativeAIProvider;
  private groq: GroqProvider;
  private mistral: MistralProvider;
  private openrouter: OpenRouterProvider;

  constructor(
    apiKey: string,
    name: string,
    apiBase: string,
    model: string,
    aiProvider: AISDKProviderType = "openai-ai-sdk"
  ) {
    super(apiKey, apiBase, model);
    this.name = name;
    this.apiKey = apiKey;
    this.apiBase = apiBase;
    this.model = model;
    this.aiProvider = aiProvider;

    if (!apiKey) {
      throw new Error(`${name} API key is required`);
    }

    this.openai = createOpenAI({ apiKey });
    this.anthropic = createAnthropic({ apiKey });
    this.google = createGoogleGenerativeAI({ apiKey });
    this.groq = createGroq({ apiKey });
    this.mistral = createMistral({ apiKey });
    this.openrouter = createOpenRouter({ apiKey });

    this.client = this.getAIModel();
  }

  private getAIModel(): LanguageModelV2 {
    switch (this.aiProvider) {
      case "openai-ai-sdk":
        return this.openai(this.model);
      case "anthropic-ai-sdk":
        return this.anthropic(this.model);
      case "google-ai-sdk":
        return this.google(this.model);
      case "groq-ai-sdk":
        return this.groq(this.model);
      case "mistral-ai-sdk":
        return this.mistral(this.model);
      case "openrouter-ai-sdk":
        return this.openrouter(this.model);
      default:
        throw new Error(`Unsupported AI provider: ${this.aiProvider}`);
    }
  }

  async generateFullStoryByRawText(
    totalRounds: number,
    choicesPerRound: number,
    contentLanguage: ContentLanguageType,
    seed: string
  ): Promise<IFullStoryResponse> {
    const requestId = this.generateRequestId();
    const systemPrompt = this.createFullStorySystemPrompt({
      contentLanguage,
    });
    const prompt = this.createFullStoryPrompt(
      totalRounds,
      choicesPerRound,
      true
    );

    this.logRequest("generateFullStory", requestId, prompt, systemPrompt, {
      totalRounds,
      choicesPerRound,
      seed,
      model: this.model,
    });

    const startTime = Date.now();
    try {
      if (!this.apiKey) {
        throw new Error(`${this.name} API key is not configured`);
      }

      let responseTime: number;

      const response = await generateText({
        model: this.getAIModel(),
        system: systemPrompt,
        prompt: prompt,
        temperature: 0.7,
        seed: seed && !isNaN(parseInt(seed)) ? parseInt(seed) : undefined,
      });

      responseTime = Date.now() - startTime;

      const jsonText = parseJSONResponse<object>(response.text);
      const parsedResponse = parseToFullStoryResponse(jsonText);

      this.logResponse(
        requestId,
        response,
        jsonText,
        parsedResponse,
        responseTime,
        undefined,
        undefined
      );

      return parsedResponse;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logResponse(
        requestId,
        undefined,
        undefined,
        undefined,
        responseTime,
        errorMessage,
        undefined
      );

      throw new Error(`Failed to generate story: ${errorMessage}`);
    }
  }

  async generateFullStory(
    totalRounds: number,
    choicesPerRound: number,
    contentLanguage: ContentLanguageType,
    seed: string
  ): Promise<IFullStoryResponse> {
    const requestId = this.generateRequestId();
    const systemPrompt = this.createFullStorySystemPrompt({
      contentLanguage,
    });
    const prompt = this.createFullStoryPrompt(
      totalRounds,
      choicesPerRound,
      false
    );

    this.logRequest("generateFullStory", requestId, prompt, systemPrompt, {
      totalRounds,
      choicesPerRound,
      seed,
      model: this.model,
    });

    const startTime = Date.now();
    try {
      if (!this.apiKey) {
        throw new Error(`${this.name} API key is not configured`);
      }

      let responseTime: number;

      const response = await generateObject({
        model: this.getAIModel(),
        schema: FullStorySchema,
        system: systemPrompt,
        prompt: prompt,
        temperature: 0.7,
        seed: seed && !isNaN(parseInt(seed)) ? parseInt(seed) : undefined,
      });

      responseTime = Date.now() - startTime;
      const parsedResponse = parseToFullStoryResponse(response.object);

      this.logResponse(
        requestId,
        response,
        response.object,
        parsedResponse,
        responseTime,
        undefined,
        undefined
      );

      return response.object;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logResponse(
        requestId,
        undefined,
        undefined,
        undefined,
        responseTime,
        errorMessage,
        undefined
      );

      throw new Error(`Failed to generate story: ${errorMessage}`);
    }
  }

  async testConnection() {
    try {
      const result = await generateText({
        model: this.getAIModel(),
        prompt: "only return: OK",
      });
      console.log("result :", result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`${errorMessage}`);
    }
  }
}
