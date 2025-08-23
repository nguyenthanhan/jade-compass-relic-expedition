export interface INarrativeState {
  location: string;
  status: string;
  initItems: string[];
  storyProgress?: string;
}

export interface IChoice {
  id: string;
  title: string;
  summary: string;
  isCorrect: boolean;
  consequence: string;
  finalItems: string[];
}

export interface IGameRound {
  intro: string;
  round: number;
  location: string;
  narrativeState: INarrativeState;
  choices: IChoice[];
  failureSummary?: string;
}

export interface IFullStoryResponse {
  intro: string;
  rounds: IGameRound[];
  overallTheme: string;
}

export interface LLMProvider {
  name: string;

  generateFullStory(
    totalRounds: number,
    choicesPerRound: number,
    contentLanguage: ContentLanguageType,
    seed: string
  ): Promise<IFullStoryResponse>;

  generateRequestId(): string;
}

export type ProviderType = "openrouter" | "openai" | "anthropic" | "gemini";
export interface IProviderConfig {
  provider?: ProviderType;
  apiBase?: string;
  apiKeyManager?: { [key in ProviderType]?: string };
  model?: string;
  customModel?: string;
}

export interface IGameConfig {
  rounds?: number;
  choicesPerRound?: number;
  contentLanguage?: ContentLanguageType;
}

export interface IGameState {
  status: "idle" | "playing" | "victory" | "failure";
  currentRound: number;
  narrativeState: INarrativeState;
  choiceHistory: IChoice[];
  failureReason?: string;
  intro?: string;
  overallTheme?: string;
}

export interface ISettings {
  selectedKeyName?: string;
  gameConfig?: IGameConfig;
  providerConfig?: IProviderConfig;
}

export type ContentLanguageType = "Vietnamese" | "English";
