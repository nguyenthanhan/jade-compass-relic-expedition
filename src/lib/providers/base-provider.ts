import {
  GameRound,
  LLMProvider,
  NarrativeState,
  FullStoryResponse,
} from "@/types/game";
import { llmLogger } from "@/lib/llm-logger";

export abstract class BaseLLMProvider implements LLMProvider {
  abstract name: string;
  protected apiKey: string;
  protected apiBase: string;
  protected model: string;

  constructor(apiKey: string, apiBase: string, model: string) {
    this.apiKey = apiKey;
    this.apiBase = apiBase;
    this.model = model;
  }

  abstract getRoundEvents(
    narrativeState: NarrativeState,
    round: number,
    choicesCount: number,
    seed?: string
  ): Promise<GameRound>;
  abstract testConnection(): Promise<boolean>;

  async generateFullStory(
    totalRounds: number,
    choicesPerRound: number,
    seed?: string
  ): Promise<FullStoryResponse> {
    const systemPrompt = this.createFullStorySystemPrompt();
    const prompt = this.createFullStoryPrompt(totalRounds, choicesPerRound);

    const response = await this.makeRequest(prompt, systemPrompt);
    return this.parseJSONResponse(response);
  }

  protected createFullStorySystemPrompt(): string {
    return `You are a narrative designer for a treasure-hunting adventure game called "Jade Compass: Relic Run".
    
Your task is to create a COMPLETE, CONNECTED story spanning multiple rounds. The story must:
- Have narrative continuity between rounds
- Build tension as the player progresses
- Reference previous events and choices
- Culminate in finding the legendary Jade Compass
- Language in Vietnamese

Your response must be STRICT JSON only - no prose, no markdown, no explanations.

The game theme is ALWAYS treasure hunting with elements like:
- Ancient ruins, hidden temples, mysterious caves
- Maps, compasses, artifacts, relics
- Traps, puzzles, rival hunters
- Exotic locations that connect logically

Each round should BUILD on the previous one, creating a cohesive adventure story.`;
  }

  protected createFullStoryPrompt(
    totalRounds: number,
    choicesPerRound: number
  ): string {
    return `Generate a complete ${totalRounds}-round treasure hunting adventure.

Requirements:
1. Create a compelling intro that sets up the entire adventure
2. Generate ${totalRounds} connected rounds that form a complete story arc
3. Each round must have exactly ${choicesPerRound} choices
4. Exactly ONE choice per round must be correct (is_correct: true)
5. Randomize the order of choices! The correct choice should appear in different positions (first, second, third, etc.) across different rounds.
6. The narrative must progress logically from round to round
7. Later rounds should reference or build upon earlier events
8. The final round should culminate in finding the Jade Compass
9. Language in Vietnamese

Return ONLY a JSON object with this EXACT structure:
{
  "intro": "A compelling 1-2 sentence introduction that sets up the entire adventure",
  "overall_theme": "The overarching story theme (e.g., 'Lost Temple of the Jade Emperor')",
  "rounds": [
    {
      "round": 1,
      "narrative_state": {
        "location": "Starting location",
        "status": "Character condition",
        "items": ["starting", "inventory"],
        "story_progress": "What has happened so far"
      },
      "choices": [
        {
          "id": "r1_c1",
          "title": "First choice title",
          "summary": "What happens if you choose this (1-2 sentences)",
          "is_correct": true,
          "consequence": "How this advances the story"
        },
        {
          "id": "r1_c2",
          "title": "Second choice title",
          "summary": "What happens if you choose this",
          "is_correct": false,
          "consequence": "How this leads to failure"
        }
      ]
    }
  ]
}`;
  }

  protected createSystemPrompt(): string {
    return `You are a narrative designer for a treasure-hunting adventure game.`;
  }

  protected createRoundPrompt(
    narrativeState: NarrativeState,
    round: number,
    choicesCount: number
  ): string {
    return `Generate round ${round}`;
  }

  protected async makeRequest(
    prompt: string,
    systemPrompt: string
  ): Promise<any> {
    throw new Error("makeRequest must be implemented by subclass");
  }

  protected parseJSONResponse(text: string): any {
    try {
      const cleanText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("Failed to parse JSON response:", text);
      throw new Error("Invalid JSON response from LLM");
    }
  }

  // Helper methods for consistent logging
  protected logRequest(
    method: string,
    requestId: string,
    prompt: string,
    systemPrompt: string,
    metadata?: Record<string, any>
  ) {
    llmLogger.logRequest(this.name, method, requestId, prompt, systemPrompt, {
      model: this.model,
      apiBase: this.apiBase,
      ...metadata,
    });
  }

  protected logResponse(
    requestId: string,
    response?: string,
    responseTime?: number,
    error?: string,
    metadata?: Record<string, any>
  ) {
    llmLogger.logResponse(requestId, response, responseTime, error, metadata);
  }

  protected generateRequestId(): string {
    return llmLogger.generateRequestId();
  }
}
