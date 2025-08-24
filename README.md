![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/nguyenthanhan/jade-compass-relic-expedition?utm_source=oss&utm_medium=github&utm_campaign=nguyenthanhan%2Fjade-compass-relic-expedition&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
[![Release and Deploy](https://github.com/nguyenthanhan/jade-compass-relic-expedition/workflows/Deploy%20and%20Release/badge.svg)](https://github.com/nguyenthanhan//jade-compass-relic-expedition/actions/workflows/deploy-and-release.yml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black)](https://vercel.com/heimers-projects/jade-compass-relic-expedition)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 🎮 Jade Compass: Relic Expedition

A retro 2D pixel-art treasure hunting adventure game built with Next.js, React, and TypeScript. Navigate through perilous choices to find the legendary Jade Compass!

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ (recommended: Node.js 20+ for Next.js 15)
- pnpm (recommended) or yarn or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nguyenthanhan/jade-compass-relic-expedition.git
cd jade-compass-relic-expedition
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Development Features

- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type checking and IntelliSense
- **ESLint**: Code quality and consistency
- **Tailwind CSS**: Utility-first styling with hot reload

## 🎯 How to Play

1. **Configure Your Adventure**: Set the number of rounds (2-10) and choices per round (2-5)
2. **Choose Your Provider**: Select between Offline mode (no API needed) or connect to OpenRouter/Google Gemini for dynamic story generation
3. **Make Your Choices**: Each round presents multiple choices, but only one leads forward. Choose wisely!
4. **Reach the Treasure**: Survive all rounds to claim the Jade Compass

### Controls

- **Mouse**: Click on choice cards to select
- **Keyboard**: Press number keys (1-5) to quickly select choices
- **Tab/Enter**: Navigate with keyboard for accessibility

## 🤖 LLM Provider Configuration

### Offline Mode (Default)

No configuration needed! The game includes a rich pool of pre-written adventure scenarios.

### OpenAI

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. In the game settings, select "OpenAI" as your provider
3. Enter your API key
4. (Optional) Specify a model from the curated list or enter a custom model name

**Available Models:**

- GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo

### OpenRouter

1. Get an API key from [OpenRouter](https://openrouter.ai/)
2. In the game settings, select "OpenRouter" as your provider
3. Enter your API key
4. (Optional) Specify a model from the curated list or enter a custom model name

**Available Models:**

- DeepSeek Chat V3, DeepSeek R1 0528, Kimi K2, Qwen 3 235B A22B
- Gemini 2.0 Flash Exp, MAI DS R1, Llama 3.3 70B Instruct
- GPT OSS 20B, Qwen 3 14B, Mistral variants, Gemma 3 27B IT, GLM 4.5 Air

### Anthropic (Claude)

1. Get an API key from [Anthropic Console](https://console.anthropic.com/account/keys)
2. In the game settings, select "Anthropic" as your provider
3. Enter your API key
4. (Optional) Specify a model from the curated list or enter a custom model name

**Available Models:**

- Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4, Claude 3.7 Sonnet, Claude 3.5 Haiku

### Google Gemini

1. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. In the game settings, select "Google Gemini" as your provider
3. Enter your API key
4. (Optional) Specify a model (default: gemini-2.5-flash)

**Available Models:**

- Gemini 2.5 Flash, Gemini 2.5 Pro, Gemini 2.0 Flash

## 🏗️ Architecture

### Next.js 15 Features

- **App Router**: Modern file-based routing with nested layouts
- **Server Components**: Improved performance with server-side rendering
- **Streaming**: Progressive loading for better user experience
- **Turbopack**: Faster development builds (when available)
- **Image Optimization**: Automatic image optimization and WebP support
- **Font Optimization**: System font stack with fallbacks

### Provider Adapter Pattern

The game uses an adapter pattern for LLM providers, making it easy to add new AI providers. Each provider implements a consistent interface for generating game events. Currently supports OpenAI, OpenRouter, Anthropic, and Google Gemini.

### Narrative State Management

Story continuity is maintained through a minimal state object containing location, status, and items. The state evolves with each choice, creating a cohesive adventure narrative.

### Fallback System

- Primary: Connected LLM provider (OpenAI/OpenRouter/Anthropic/Gemini)
- Fallback: Offline event pool with 8+ unique scenarios
- Automatic fallback on timeout (10s) or error

### Code Architecture

- **Component Refactoring**: Home page split into smaller, maintainable components
- **Custom Hooks**: `useSettings` hook for centralized settings management
- **Constants Management**: Centralized provider data and model lists
- **Type Safety**: Improved TypeScript types and interfaces

### UI/UX Improvements

- **Streamlined Model Selection**: Simplified model lists with clean, minimal interface
- **Integrated Test Button**: Test connection button positioned in the modal footer for better workflow
- **Enhanced Visual Design**: Improved button styling with destructive cancel button and secondary test button
- **Better Accessibility**: Improved focus management and visual feedback
- **Introduction Card**: Detailed gameplay instructions and tips
- **Auto-save**: Settings automatically saved when changed

## 🎨 Features

- **Retro Pixel-Art Style**: Authentic 2D pixel-art aesthetic with custom animations
- **Multiple Endings**: Victory screen with Vietnamese easter egg, detailed failure summaries
- **Accessibility**: Full keyboard navigation, ARIA labels, focus management
- **Secrets Handling**: API keys kept in-memory only (not stored in Local Storage)
- **Responsive Design**: Playable on desktop and mobile devices with Next.js 15 optimizations
- **Smart Fallbacks**: Graceful degradation when LLM services are unavailable
- **Modern Web Standards**: Built with the latest Next.js 15 features and React 18+ capabilities

## 🛠️ Development

### Key Technologies

- **Next.js 15**: React framework with App Router, Server Components, and latest optimizations
- **React 18+**: Latest React features with concurrent rendering
- **TypeScript 5+**: Type-safe development with latest language features
- **Tailwind CSS 3+**: Utility-first styling with custom CSS variables and JIT compilation
- **Sonner**: Modern toast notifications
- **Lucide Icons**: Beautiful, customizable icon library

### Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── pages/        # Page components
│   ├── home/         # Home page components (refactored)
│   └── game/         # Game-specific components
├── contexts/         # React contexts
├── hooks/            # Custom hooks (use-settings, use-round-data)
├── types/            # TypeScript type definitions
├── lib/
│   └── providers/    # LLM provider adapters
└── utils/            # Utility functions
```

## 📝 Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint for code quality
- `pnpm run type-check` - Run TypeScript type checking
- `pnpm run clean` - Clean build cache and dependencies

## 🔒 Security

- API keys are stored in your browser's `localStorage` for convenience
- They are never logged or transmitted to any server
- You can clear them by clearing your browser's site data
- HTTPS recommended for production

## 🚀 Recent Updates

- **Code Refactoring**: Split home page into smaller, maintainable components
- **Custom Hooks**: Extracted settings logic into reusable `useSettings` hook
- **Constants Management**: Centralized provider data and model lists
- **Performance Fixes**: Resolved infinite re-render loops and optimized context updates
- **Provider Support**: Added OpenAI and Anthropic (Claude) providers
- **Auto-save Feature**: Settings automatically saved when changed
- **Introduction Card**: Added detailed gameplay instructions and tips
- **CORS Fixes**: Resolved API endpoint configuration issues
- **Type Safety**: Improved TypeScript types and interfaces

---

**Ready for adventure?** Start your treasure hunt now! 🗺️💎
