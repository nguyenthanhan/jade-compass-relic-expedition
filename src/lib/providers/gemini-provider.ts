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
      this.logRequest(
        "testConnection",
        this.generateRequestId(),
        this.model,
        this.apiKey
      );
      // Minimal authenticated call to validate API key
      const url = `${this.apiBase}/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "ping" }] }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 1,
            responseMimeType: "application/json",
          },
        }),
      });

      // Explicitly fail on auth errors
      if (resp.status === 401 || resp.status === 403) return false;

      // Success range: consider key valid; validate payload if possible
      if (resp.ok) {
        try {
          const data = await resp.json();
          if (
            data &&
            Array.isArray(data.candidates) &&
            data.candidates.length > 0
          ) {
            return true;
          }
          return true; // key worked even if payload is unexpected
        } catch {
          return true; // key worked
        }
      }

      return false;
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

    // Log the full response for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.log("Gemini API Response:", JSON.stringify(data, null, 2));
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No candidates in Gemini response");
    }

    const candidate = data.candidates[0];
    if (!candidate.content) {
      throw new Error("No content in Gemini candidate");
    }

    if (!candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error("No parts in Gemini content");
    }

    const text = candidate.content.parts[0].text;
    if (!text) {
      throw new Error("No text in Gemini response part");
    }

    return text;
  }
}
