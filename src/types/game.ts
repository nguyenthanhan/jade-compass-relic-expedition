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

  getModels(): Promise<void>;
  testConnection(): Promise<void>;
}

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

export type PopularProviderType =
  | "openrouter"
  | "openai"
  | "anthropic"
  | "google"
  | "mistral";

export type AISDKProviderType =
  | "openai-ai-sdk"
  | "anthropic-ai-sdk"
  | "google-ai-sdk"
  | "groq-ai-sdk"
  | "mistral-ai-sdk"
  | "openrouter-ai-sdk";

export type ProviderType = PopularProviderType | AISDKProviderType;

export type ProviderDataType = {
  [key in ProviderType]: {
    providerName: string;
    apiBase: string;
    link: string;
    models: { value: string; label?: string }[];
    defaultModel: string;
  };
};
