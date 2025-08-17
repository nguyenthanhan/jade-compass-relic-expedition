import { GameRound, NarrativeState, FullStoryResponse } from "@/types/game";
import { BaseLLMProvider } from "./base-provider";

export class OpenRouterProvider extends BaseLLMProvider {
  name = "OpenRouter";

  constructor(
    apiKey: string,
    model: string = "meta-llama/llama-3.2-3b-instruct:free"
  ) {
    super(apiKey, "https://openrouter.ai/api/v1", model);
  }

  async getRoundEvents(
    narrativeState: NarrativeState,
    round: number,
    choicesCount: number,
    seed?: string
  ): Promise<GameRound> {
    const requestId = this.generateRequestId();
    const systemPrompt = this.createSystemPrompt();
    const prompt = this.createRoundPrompt(narrativeState, round, choicesCount);

    this.logRequest("getRoundEvents", requestId, prompt, systemPrompt, {
      narrativeState,
      round,
      choicesCount,
      seed,
    });

    const startTime = Date.now();
    try {
      const response = await this.makeRequest(prompt, systemPrompt);
      const responseTime = Date.now() - startTime;

      this.logResponse(requestId, response, responseTime);

      return this.parseJSONResponse(response);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logResponse(
        requestId,
        undefined,
        responseTime,
        (error as Error).message
      );
      throw error;
    }
  }

  async generateFullStory(
    totalRounds: number,
    choicesPerRound: number,
    seed?: string
  ): Promise<FullStoryResponse> {
    const requestId = this.generateRequestId();
    const systemPrompt = this.createFullStorySystemPrompt();
    const prompt = this.createFullStoryPrompt(totalRounds, choicesPerRound);

    this.logRequest("generateFullStory", requestId, prompt, systemPrompt, {
      totalRounds,
      choicesPerRound,
      seed,
    });

    const startTime = Date.now();
    try {
      const response = await this.makeRequest(prompt, systemPrompt);
      const responseTime = Date.now() - startTime;

      this.logResponse(requestId, response, responseTime, undefined, {
        estimatedTokens: Math.floor(response.length / 4),
      });

      return this.parseJSONResponse(response);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logResponse(
        requestId,
        undefined,
        responseTime,
        (error as Error).message
      );
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBase}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": "https://jade-compass.vercel.app",
          "X-Title": "Jade Compass: Relic Run",
        },
      });
      return response.ok;
    } catch (error) {
      console.error("OpenRouter connection test failed:", error);
      return false;
    }
  }

  protected async makeRequest(
    prompt: string,
    systemPrompt: string
  ): Promise<string> {
    const response = await fetch(`${this.apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "HTTP-Referer": "https://jade-compass.vercel.app",
        "X-Title": "Jade Compass: Relic Run",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
