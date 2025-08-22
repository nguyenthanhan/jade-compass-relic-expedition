![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/nguyenthanhan/jade-compass-relic-expedition?utm_source=oss&utm_medium=github&utm_campaign=nguyenthanhan%2Fjade-compass-relic-expedition&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
[![Release and Deploy](https://github.com/nguyenthanhan//jade-compass-relic-expedition/workflows/Deploy%20and%20Release/badge.svg)](https://github.com/nguyenthanhan//jade-compass-relic-expedition/actions/workflows/deploy-and-release.yml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black)](https://vercel.com/heimers-projects/jade-compass-relic-expedition)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 🎮 Jade Compass: Relic Expedition

A retro 2D pixel-art treasure hunting adventure game built with Next.js, React, and TypeScript. Navigate through perilous choices to find the legendary Jade Compass!

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- pnpm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/jade-compass-relic-expedition.git
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

### OpenRouter

1. Get an API key from [OpenRouter](https://openrouter.ai/)
2. In the game settings, select "OpenRouter" as your provider
3. Enter your API key
4. (Optional) Specify a model from the curated list or enter a custom model name

**Available Models:**

- DeepSeek Chat V3 (free tier)
- DeepSeek R1 0528 (free tier)
- Kimi K2 (free tier)
- Qwen 3 235B A22B (free tier)
- Gemini 2.0 Flash Exp (free tier)
- MAI DS R1 (free tier)
- Llama 3.3 70B Instruct (free tier)
- GPT OSS 20B (free tier)
- And more...

### Google Gemini

1. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. In the game settings, select "Google Gemini" as your provider
3. Enter your API key
4. (Optional) Specify a model (default: gemini-2.5-flash)

**Available Models:**

- Gemini 2.5 Flash
- Gemini 2.5 Pro
- Gemini 2.0 Flash

## 🏗️ Architecture

### Provider Adapter Pattern

The game uses an adapter pattern for LLM providers, making it easy to add new AI providers. Each provider implements a consistent interface for generating game events.

### Narrative State Management

Story continuity is maintained through a minimal state object containing location, status, and items. The state evolves with each choice, creating a cohesive adventure narrative.

### Fallback System

- Primary: Connected LLM provider (OpenRouter/Gemini)
- Fallback: Offline event pool with 8+ unique scenarios
- Automatic fallback on timeout (10s) or error

### UI/UX Improvements

- **Streamlined Model Selection**: Simplified model lists with clean, minimal interface
- **Integrated Test Button**: Test connection button positioned in the modal footer for better workflow
- **Enhanced Visual Design**: Improved button styling with destructive cancel button and secondary test button
- **Better Accessibility**: Improved focus management and visual feedback

## 🎨 Features

- **Retro Pixel-Art Style**: Authentic 2D pixel-art aesthetic with custom animations
- **Multiple Endings**: Victory screen with Vietnamese easter egg, detailed failure summaries
- **Accessibility**: Full keyboard navigation, ARIA labels, focus management
- **Local Storage-Based**: API keys are saved in your browser's local storage for convenience, but are never transmitted anywhere else
- **Responsive Design**: Playable on desktop and mobile devices
- **Smart Fallbacks**: Graceful degradation when LLM services are unavailable

## 🛠️ Development

### Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom CSS variables
- **Sonner**: Toast notifications
- **Lucide Icons**: Icon library

### Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── pages/        # Page components
│   └── game/         # Game-specific components
├── contexts/         # React contexts
├── types/            # TypeScript type definitions
├── providers/        # LLM provider adapters
└── utils/            # Utility functions
```

## 📝 Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm run type-check` - Run TypeScript type checking

## 🔒 Security

- API keys are stored in your browser's `localStorage` for convenience
- They are never logged or transmitted to any server
- You can clear them by clearing your browser's site data
- HTTPS recommended for production

## 🚀 Recent Updates

- **Simplified Model Lists**: Removed verbose labels and descriptions for cleaner interface
- **Improved Modal Layout**: Test connection button moved to footer for better UX
- **Enhanced Button Styling**: Better visual hierarchy with destructive cancel and secondary test buttons
- **Code Cleanup**: Streamlined model data structures and improved maintainability

---

**Ready for adventure?** Start your treasure hunt now! 🗺️💎
