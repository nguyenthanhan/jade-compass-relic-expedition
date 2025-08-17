export interface NarrativeState {
  location: string;
  status: string;
  items: string[];
  story_progress?: string;
  [key: string]: any;
}

export interface Choice {
  id: string;
  title: string;
  summary: string;
  is_correct: boolean;
  consequence: string;
}

export interface GameRound {
  intro: string;
  round: number;
  location: string;
  narrative_state: NarrativeState;
  choices: Choice[];
  failure_summary?: string;
}

export interface FullStoryResponse {
  intro: string;
  rounds: GameRound[];
  overall_theme?: string;
}

export interface LLMProvider {
  name: string;
  getRoundEvents(
    narrativeState: NarrativeState,
    round: number,
    choicesCount: number,
    seed?: string
  ): Promise<GameRound>;
  generateFullStory(
    totalRounds: number,
    choicesPerRound: number,
    seed?: string
  ): Promise<FullStoryResponse>;
  testConnection(): Promise<boolean>;
}

export interface ProviderConfig {
  provider: "openrouter" | "gemini" | "offline";
  apiBase?: string;
  apiKey?: string;
  model?: string;
}

export interface GameConfig {
  rounds: number;
  choicesPerRound: number;
  providerConfig: ProviderConfig;
}

export interface GameState {
  status: "idle" | "playing" | "victory" | "failure";
  currentRound: number;
  narrativeState: NarrativeState;
  choiceHistory: Choice[];
  failureReason?: string;
  intro?: string;
}
