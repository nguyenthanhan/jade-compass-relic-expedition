import { ProviderDataType } from "@/types/game";

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
    value: "qwen3-coder:free",
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
    value: "gpt-5",
  },
  {
    value: "gpt-5-mini",
  },
  {
    value: "gpt-5-nano",
  },
  {
    value: "gpt-5-chat-latest",
  },
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
    value: "claude-opus-4-latest",
  },
  {
    value: "claude-sonnet-4-latest",
  },
  {
    value: "claude-3-7-sonnet-latest",
  },
  {
    value: "claude-3-5-sonnet-latest",
  },
  {
    value: "claude-3-5-haiku-latest",
  },
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

const GOOGLE_MODELS = [
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
    value: "gemini-2.0-flash-exp",
  },
  {
    value: "gemini-1.5-flash",
  },
  {
    value: "gemini-1.5-pro",
  },
  {
    value: "__custom__",
    label: "Custom Model (Enter below)",
  },
];

const GROQ_MODELS = [
  {
    value: "meta-llama/llama-4-scout-17b-16e-instruct",
  },
  {
    value: "llama-3.3-70b-versatile",
  },
  {
    value: "llama-3.1-8b-instant",
  },
  {
    value: "mixtral-8x7b-32768",
  },
  {
    value: "gemma2-9b-it",
  },
  {
    value: "__custom__",
    label: "Custom Model (Enter below)",
  },
];

const MISTRAL_MODELS = [
  {
    value: "mistral-large-latest",
  },
  {
    value: "mistral-medium-latest",
  },
  {
    value: "mistral-small-latest",
  },
  {
    value: "pixtral-large-latest",
  },
  {
    value: "pixtral-12b-2409",
  },
  {
    value: "mistral-medium-2505",
  },
  {
    value: "__custom__",
    label: "Custom Model (Enter below)",
  },
];

export const providerData: ProviderDataType = {
  // Popular Providers
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
  google: {
    providerName: "Google",
    apiBase: "https://generativelanguage.googleapis.com",
    link: "aistudio.google.com/app/apikey",
    models: GOOGLE_MODELS,
    defaultModel: GOOGLE_MODELS[0].value,
  },
  mistral: {
    providerName: "Mistral",
    apiBase: "https://api.mistral.ai",
    link: "console.mistral.ai/api-keys",
    models: MISTRAL_MODELS,
    defaultModel: MISTRAL_MODELS[0].value,
  },
  // AI SDK Providers
  "openai-ai-sdk": {
    providerName: "OpenAI (AI SDK)",
    apiBase: "https://api.openai.com/v1",
    link: "platform.openai.com/api-keys",
    models: OPENAI_MODELS,
    defaultModel: OPENAI_MODELS[0].value,
  },
  "anthropic-ai-sdk": {
    providerName: "Anthropic (AI SDK)",
    apiBase: "https://api.anthropic.com",
    link: "console.anthropic.com/account/keys",
    models: ANTHROPIC_MODELS,
    defaultModel: ANTHROPIC_MODELS[0].value,
  },
  "google-ai-sdk": {
    providerName: "Google (AI SDK)",
    apiBase: "https://generativelanguage.googleapis.com",
    link: "aistudio.google.com/app/apikey",
    models: GOOGLE_MODELS,
    defaultModel: GOOGLE_MODELS[0].value,
  },
  "groq-ai-sdk": {
    providerName: "Groq (AI SDK)",
    apiBase: "https://api.groq.com/openai/v1",
    link: "console.groq.com/keys",
    models: GROQ_MODELS,
    defaultModel: GROQ_MODELS[0].value,
  },
  "mistral-ai-sdk": {
    providerName: "Mistral (AI SDK)",
    apiBase: "https://api.mistral.ai",
    link: "console.mistral.ai/api-keys",
    models: MISTRAL_MODELS,
    defaultModel: MISTRAL_MODELS[0].value,
  },
  "openrouter-ai-sdk": {
    providerName: "OpenRouter (AI SDK)",
    apiBase: "https://openrouter.ai/api/v1",
    link: "openrouter.ai/keys",
    models: OPENROUTER_MODELS,
    defaultModel: OPENROUTER_MODELS[0].value,
  },
};
