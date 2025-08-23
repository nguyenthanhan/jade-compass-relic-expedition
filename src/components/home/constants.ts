const OPENROUTER_MODELS = [
  {
    value: "deepseek/deepseek-chat-v3-0324:free",
  },
  {
    value: "deepseek/deepseek-r1-0528:free",
  },
  {
    value: "moonshotai/kimi-k2:free",
  },
  {
    value: "qwen/qwen3-235b-a22b:free",
  },
  {
    value: "google/gemini-2.0-flash-exp:free",
  },
  {
    value: "microsoft/mai-ds-r1:free",
  },
  {
    value: "meta-llama/llama-3.3-70b-instruct:free",
  },
  {
    value: "openai/gpt-oss-20b:free",
  },
  {
    value: "qwen/qwen3-14b:free",
  },
  {
    value: "mistralai/mistral-small-3.2-24b-instruct:free",
  },
  {
    value: "mistralai/mistral-nemo:free",
  },
  {
    value: "mistralai/mistral-small-3.1-24b-instruct:free",
  },
  {
    value: "google/gemma-3-27b-it:free",
  },
  {
    value: "z-ai/glm-4.5-air:free",
  },
  {
    value: "__custom__",
    label: "Custom Model (Enter below)",
  },
];

const OPENAI_MODELS = [
  {
    value: "gpt-4o",
  },
  {
    value: "gpt-4o-mini",
  },
  {
    value: "gpt-4-turbo",
  },
  {
    value: "gpt-4",
  },
  {
    value: "gpt-3.5-turbo",
  },
  {
    value: "__custom__",
    label: "Custom Model (Enter below)",
  },
];

const ANTHROPIC_MODELS = [
  {
    value: "claude-opus-4-1-20250805",
  },
  {
    value: "claude-opus-4-20250514",
  },
  {
    value: "claude-sonnet-4-20250514",
  },
  {
    value: "claude-3-7-sonnet-20250219",
  },
  {
    value: "claude-3-5-haiku-20241022",
  },
  {
    value: "claude-3-haiku-20240307",
  },
  {
    value: "__custom__",
    label: "Custom Model (Enter below)",
  },
];

const GEMINI_MODELS = [
  {
    value: "gemini-2.5-flash",
  },
  {
    value: "gemini-2.5-pro",
  },
  {
    value: "gemini-2.0-flash",
  },
  {
    value: "__custom__",
    label: "Custom Model (Enter below)",
  },
];

export const providerData = {
  openrouter: {
    providerName: "OpenRouter",
    apiBase: "https://openrouter.ai/api/v1",
    link: "openrouter.ai/keys",
    models: OPENROUTER_MODELS,
    defaultModel: OPENROUTER_MODELS[0].value,
  },
  openai: {
    providerName: "OpenAI",
    apiBase: "https://api.openai.com/v1",
    link: "platform.openai.com/api-keys",
    models: OPENAI_MODELS,
    defaultModel: OPENAI_MODELS[0].value,
  },
  anthropic: {
    providerName: "Anthropic",
    apiBase: "https://api.anthropic.com/v1",
    link: "console.anthropic.com/account/keys",
    models: ANTHROPIC_MODELS,
    defaultModel: ANTHROPIC_MODELS[0].value,
  },
  gemini: {
    providerName: "Gemini",
    apiBase: "https://generativelanguage.googleapis.com",
    link: "aistudio.google.com/app/apikey",
    models: GEMINI_MODELS,
    defaultModel: GEMINI_MODELS[0].value,
  },
};

export type ProviderDataType = typeof providerData;
