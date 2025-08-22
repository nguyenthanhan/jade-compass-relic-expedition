import { FullStoryResponse } from "@/types/game";
import { BaseLLMProvider } from "./base-provider";

export class GeminiProvider extends BaseLLMProvider {
  name = "Google Gemini";

  constructor(apiKey: string, model: string = "gemini-1.5-flash") {
    super(apiKey, "https://generativelanguage.googleapis.com", model);
  }

  async generateFullStory(
    totalRounds: number,
    choicesPerRound: number,
    seed?: string
  ): Promise<FullStoryResponse> {
    //TODO
    return this.parseJSONResponse("");
  }

  async testConnection(): Promise<boolean> {
    return false;
  }
}
