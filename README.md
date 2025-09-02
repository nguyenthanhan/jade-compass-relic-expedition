![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/nguyenthanhan/jade-compass-relic-expedition?utm_source=oss&utm_medium=github&utm_campaign=nguyenthanhan%2Fjade-compass-relic-expedition&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
[![Release and Deploy](https://github.com/nguyenthanhan/jade-compass-relic-expedition/workflows/Deploy%20and%20Release/badge.svg)](https://github.com/nguyenthanhan/jade-compass-relic-expedition/actions/workflows/deploy-and-release.yml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black)](https://vercel.com/heimers-projects/jade-compass-relic-expedition)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 🎮 Jade Compass: Relic Expedition

A retro 2D pixel-art treasure hunting adventure game built with Next.js, React, and TypeScript. Navigate through perilous choices to find the legendary Jade Compass!

## 🚀 Quick Start

**Prerequisites**: Node.js 18+ (recommended: 20+), pnpm/yarn/npm

1. **Clone & Install**:

```bash
git clone https://github.com/nguyenthanhan/jade-compass-relic-expedition.git
cd jade-compass-relic-expedition
pnpm install
```

2. **Run Development Server**:

```bash
pnpm run dev
```

3. **Open** [http://localhost:3000](http://localhost:3000) in your browser

**Features**: Hot reload, TypeScript, ESLint, Tailwind CSS

## 🎯 How to Play

1. **Configure**: Set rounds (2-10) and choices per round (2-5)
2. **Choose Provider**: Offline mode or connect to AI providers for dynamic stories
3. **Make Choices**: Each round has multiple choices, but only one leads forward
4. **Find Treasure**: Survive all rounds to claim the Jade Compass

**Controls**: Mouse clicks, number keys (1-5), or Tab/Enter for accessibility

## 🤖 LLM Provider Configuration

### Offline Mode (Default)

No configuration needed! The game includes pre-written adventure scenarios.

### API Providers

**Setup**: Get API key → Select provider → Enter key → (Optional) Choose model

**Supported Providers**:

- **OpenAI**: GPT-5, GPT-4, GPT-3.5 models
- **OpenRouter**: DeepSeek, Kimi, Qwen, Llama, Mistral variants
- **Anthropic**: Claude Opus, Sonnet models
- **Google**: Gemini 2.5, 2.0 models
- **Mistral**: Mistral and Pixtral models
- **Groq**: Llama, Mixtral, Gemma models

**AI SDK Variants**: Enhanced functionality available for all providers

## 🎨 Features

**Visual**: Retro pixel-art style with custom animations  
**Gameplay**: Multiple endings, choice-based progression  
**Accessibility**: Full keyboard navigation, ARIA labels, focus management  
**Technical**: Responsive design, localStorage for API keys, smart fallbacks, Next.js 15 + React 19+

## 🛠️ Development

**Tech Stack**: Next.js 15, React 19+, TypeScript 5+, Tailwind CSS 4, Sonner, Lucide Icons

**Structure**:

```
src/
├── components/       # UI, pages, home, game components
├── contexts/         # React contexts
├── hooks/           # Custom hooks (use-settings, use-round-data)
├── types/           # TypeScript definitions
├── lib/providers/   # LLM provider adapters
└── utils/           # Utility functions
```

## 📝 Scripts

**Development**: `pnpm dev` (start), `pnpm build` (build), `pnpm start` (production)  
**Quality**: `pnpm lint` (ESLint), `pnpm type-check` (TypeScript)  
**Release**: `pnpm release` (auto-version), `pnpm changelog` (extract)

## 🔒 Security

**API Keys**: Never logged or transmitted to our backend, sent directly to provider APIs  
**Storage**: Browser localStorage, clearable via site data  
**Production**: HTTPS recommended

## 🚀 Recent Updates

**New Providers**: Mistral, Groq, plus AI SDK variants for all providers  
**Improvements**: Enhanced error handling, code refactoring, custom hooks, centralized constants  
**Fixes**: Performance optimization, auto-save, CORS resolution, TypeScript types  
**Features**: Release automation, repository migration

---

**Ready for adventure?** Start your treasure hunt now! 🗺️💎
