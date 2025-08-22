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
4. (Optional) Specify a model, or use the default free model

### Google Gemini

1. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. In the game settings, select "Google Gemini" as your provider
3. Enter your API key
4. (Optional) Specify a model (default: gemini-1.5-flash)

## 🏗️ Architecture

### Provider Adapter Pattern

The game uses an adapter pattern for LLM providers, making it easy to add new AI providers.

### Narrative State Management

Story continuity is maintained through a minimal state object containing location, status, and items.

### Fallback System

- Primary: Connected LLM provider (OpenRouter/Gemini)
- Fallback: Offline event pool with 8+ unique scenarios
- Automatic fallback on timeout (10s) or error

## 🎨 Features

- **Retro Pixel-Art Style**: Authentic 2D pixel-art aesthetic with custom animations
- **Multiple Endings**: Victory screen with Vietnamese easter egg, detailed failure summaries
- **Accessibility**: Full keyboard navigation, ARIA labels, focus management
- **Local Storage-Based**: API keys are saved in your browser's local storage for convenience, but are never transmitted anywhere else.
- **Responsive Design**: Playable on desktop and mobile devices

## 🛠️ Development

### Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Sonner**: Toast notifications
- **Lucide Icons**: Icon library

## 📝 Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server

## 🔒 Security

- API keys are stored in your browser's `localStorage` for convenience.
- They are never logged or transmitted to any server.
- You can clear them by clearing your browser's site data.
- HTTPS recommended for production

---

**Ready for adventure?** Start your treasure hunt now! 🗺️💎
