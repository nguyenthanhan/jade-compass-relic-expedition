import { OpenAI } from "openai";
import { FullStoryResponse } from "@/types/game";
import { BaseLLMProvider } from "./base-provider";

export class OpenRouterProvider extends BaseLLMProvider {
  name = "OpenRouter";
  private client: OpenAI;

  constructor(
    apiKey: string,
    model: string = "meta-llama/llama-3.2-3b-instruct:free"
  ) {
    super(apiKey, "https://openrouter.ai/api/v1", model);

    if (!apiKey) {
      throw new Error("OpenRouter API key is required");
    }

    this.client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.apiBase,
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        //   "HTTP-Referer": "https://jade-compass.vercel.app",
        "X-Title": "Jade Compass: Relic Expedition",
      },
    });
  }

  async generateFullStory(
    totalRounds: number,
    choicesPerRound: number,
    seed?: string
  ): Promise<FullStoryResponse> {
    const requestId = this.generateRequestId();
    const systemPrompt = this.createFullStorySystemPrompt({
      contentLanguage: "Vietnamese",
    });
    const prompt = this.createFullStoryPrompt(totalRounds, choicesPerRound);

    this.logRequest("generateFullStory", requestId, prompt, systemPrompt, {
      totalRounds,
      choicesPerRound,
      seed,
      model: this.model,
    });

    const startTime = Date.now();
    try {
      if (!this.apiKey) {
        throw new Error("OpenRouter API key is not configured");
      }

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        seed: seed ? parseInt(seed) : undefined,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No content in response from OpenRouter");
      }

      const responseTime = Date.now() - startTime;
      this.logResponse(requestId, content, responseTime, undefined, {
        model: this.model,
        estimatedTokens:
          response.usage?.total_tokens || Math.floor(content.length / 4),
      });

      const parsedResponse = this.parseJSONResponse(content);

      if (
        !parsedResponse ||
        !parsedResponse.rounds ||
        !Array.isArray(parsedResponse.rounds)
      ) {
        throw new Error("Invalid response format from OpenRouter");
      }

      return parsedResponse;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logResponse(requestId, undefined, responseTime, errorMessage, {
        model: this.model,
        error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      });

      throw new Error(`Failed to generate story: ${errorMessage}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.models.retrieve(this.model);
      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }
}
