import { GameRound, NarrativeState, FullStoryResponse } from "@/types/game";
import { BaseLLMProvider } from "./base-provider";

export class GeminiProvider extends BaseLLMProvider {
  name = "Google Gemini";

  constructor(apiKey: string, model: string = "gemini-1.5-flash") {
    super(apiKey, "https://generativelanguage.googleapis.com", model);
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
      const response = await fetch(
        `${this.apiBase}/v1beta/models?key=${this.apiKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Gemini connection test failed:", error);
      return false;
    }
  }

  protected async makeRequest(
    prompt: string,
    systemPrompt: string
  ): Promise<string> {
    const url = `${this.apiBase}/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2000,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response structure from Gemini");
    }

    return data.candidates[0].content.parts[0].text;
  }
}
