import { Mistral } from "@mistralai/mistralai";
import { ContentLanguageType, IFullStoryResponse } from "@/types/game";
import { BaseLLMProvider } from "./base";
import { parseToFullStoryResponse } from "@/utils/response-parser";
import { parseJSONResponse } from "@/utils/string";
import { logger } from "../logger";

export class MistralProvider extends BaseLLMProvider {
  name: string;
  protected apiKey: string;
  protected apiBase: string;
  protected model: string;
  private client: Mistral;

  constructor(apiKey: string, name: string, apiBase: string, model: string) {
    super(apiKey, apiBase, model);
    this.name = name;
    this.apiKey = apiKey;
    this.apiBase = apiBase;
    this.model = model;

    if (!apiKey) {
      throw new Error(`${name} API key is required`);
    }

    this.client = new Mistral({ apiKey: this.apiKey });
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

      const responseTime = Date.now() - startTime;

      const response = await this.client.chat.complete({
        model: this.model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        // maxTokens: 4000,
      });

      const jsonText = parseJSONResponse<object>(
        (response.choices[0].message.content as string) || ""
      );
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

  async testModelsAvailability() {
    try {
      const models = await this.client.models.list();
      logger.log("Mistral models:", models);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`${errorMessage}`);
    }
  }

  async testConnection() {
    await this.testModelsAvailability();
  }
}
