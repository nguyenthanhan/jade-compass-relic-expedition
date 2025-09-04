# Repository Guidelines

## 📋 Project Overview

**Jade Compass: Relic Expedition** is a 2D pixel-art treasure-hunting adventure game built with Next.js, React, and TypeScript. The game leverages AI to dynamically generate adventure storylines based on player choices.

**Repository**: [https://github.com/nguyenthanhan/jade-compass-relic-expedition](https://github.com/nguyenthanhan/jade-compass-relic-expedition)

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19+, TypeScript 5+
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Icons**: Lucide Icons
- **Package Manager**: pnpm
- **Deployment**: Vercel

## Project Structure & Module Organization

- `src/app/`: Next.js App Router entry (`layout.tsx`, `page.tsx`), global styles `globals.css`.
- `src/components/`: Reusable UI and page components (e.g., `components/ui/button.tsx`).
- `src/components/pages/`: Page-specific components (e.g., `home.tsx`, game components).
- `src/components/home/`: Home page components split into smaller, maintainable pieces.
- `src/contexts/`: React context state (e.g., `game-context.tsx`).
- `src/hooks/`: Custom React hooks (e.g., `use-settings.ts`, `use-round-data.ts`).
- `src/lib/`: Utilities and providers (LLM adapters in `lib/providers/*`).
- `src/types/`: Shared TypeScript types (e.g., `types/game.ts`).
- `src/utils/`: Utility functions (e.g., `response-parser.ts`, `string.ts`).
- `public/`: Static assets. Build output lives in `.next/`.

### Detailed Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── favicon.ico        # App icon
├── components/            # React components
│   ├── home/              # Home page components
│   ├── pages/             # Game page components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
│   └── game-context.tsx   # Game state management
├── hooks/                 # Custom React hooks
│   ├── use-settings.ts    # Settings management hook
│   └── use-round-data.ts  # Round data management hook
├── lib/                   # Utility libraries
│   ├── providers/         # AI provider implementations
│   │   ├── base.ts        # Base provider interface
│   │   ├── provider-factory.ts # Provider factory
│   │   ├── openai.ts      # OpenAI provider
│   │   ├── anthropic.ts   # Anthropic provider
│   │   ├── google.ts      # Google provider
│   │   ├── mistral.ts     # Mistral provider
│   │   └── vercel.ts      # Vercel AI SDK provider
│   └── logger.ts          # Logging utility
├── types/                 # TypeScript definitions
│   └── game.ts            # Game type definitions
└── utils/                 # Utility functions
    ├── response-parser.ts # Response parsing utilities
    └── string.ts          # String manipulation utilities
```

## 🎮 Game Logic & Flow

### Game States

The game consists of four main states:

1. **Home** – Start screen and game configuration
2. **Game** – Active gameplay
3. **Victory** – Winning screen
4. **Failure** – Game over

### Flow

1. **Setup**: Player chooses the number of rounds (2–10) and choices per round (2–5)
2. **AI Provider Selection**: Play in offline mode or connect to AI providers
3. **Gameplay**: Make choices in each round
4. **Endgame**: Win (discover the Jade Compass) or lose

### Rules

- Each round offers multiple options, but only one correct choice
- All rounds must be cleared to win
- Multiple endings based on player decisions

## Build, Test, and Development Commands

- `pnpm dev`: Start the local dev server at `http://localhost:3000`.
- `pnpm build`: Production build.
- `pnpm start`: Run the built app.
- `pnpm lint`: Run Next.js/ESLint checks.
- `pnpm type-check`: Run TypeScript type checking.
- `pnpm release`: Create a new release with automatic versioning.
- `pnpm changelog`: Extract changelog from commit messages.

**Tip**: npm equivalents exist (e.g., `npm run dev`), but this repo uses `pnpm` as the primary package manager.

### Environment Setup

```bash
# Required environment variables
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
# ... other provider keys
```

## Coding Style & Naming Conventions

- **TypeScript**: Strict mode enabled; prefer explicit types for public APIs.
- **Indentation**: 2 spaces; no semicolons required by tooling is fine.
- **File names**: kebab-case (e.g., `game-context.tsx`, `openai-provider.ts`).
- **React components**: PascalCase component names inside lower-case files; default export when a file holds a single component.
- **Hooks**: prefix with `use-` and return typed values.
- **Imports**: prefer `@/` alias for code under `src/`.
- **Styling**: Tailwind CSS utilities in `globals.css` and component classes; avoid inline styles.
- **Icons**: Use Lucide React icons imported from `lucide-react`.

## UI/UX Guidelines

- **Design System**: Follow the established retro pixel-art theme with consistent color variables.
- **Component Variants**: Use appropriate button variants (`default`, `outline`, `secondary`, `destructive`).
- **Accessibility**: Include ARIA labels, proper focus management, and keyboard navigation.
- **Responsive Design**: Ensure components work on both desktop and mobile devices.
- **Modal Design**: Use consistent modal patterns with proper backdrop and focus trapping.

### Design System Details

- **Theme**: Retro pixel-art adventure style
- **Palette**: Earth tones with accent highlights
- **Typography**: Modern fonts with retro character
- **Animations**: Custom CSS transitions and effects

### Component Groups

- **Home**: Setup screens, AI configuration, introduction
- **Game**: Main interface, choices, progress tracking
- **Pages**: Victory, failure, home
- **UI**: Reusable widgets (buttons, cards, etc.)

### Accessibility Features

- Full keyboard navigation
- ARIA labels for screen readers
- Focus indicators
- Mobile responsiveness

## LLM Provider Development

- **Adapter Pattern**: All providers must implement the same interface for consistency.
- **Error Handling**: Implement robust fallback to offline mode on failures with clear error messages.
- **Type Safety**: Use strict typing for provider responses and error states.
- **Testing**: Mock network calls in tests; avoid real API calls during development.
- **Provider Support**: Currently supports OpenAI, OpenRouter, Anthropic, Google Gemini, and Mistral as direct API providers, plus Groq via AI SDK.
- **AI SDK Integration**: Supports both direct API providers and Vercel AI SDK providers for enhanced functionality.
- **API Base URLs**: Use correct API endpoints from centralized constants.
- **CORS Handling**: Proper CORS configuration for cross-origin requests.
- **Error Messages**: Provide meaningful error messages in `testConnection()` and other methods for better user experience.

### Provider Architecture

- **Base Provider** (`base.ts`): Abstract interface defining LLM provider contract
- **Provider Factory** (`provider-factory.ts`): Creates and manages provider instances
- **Individual Providers**: Specific implementations per AI service
  - `openai.ts`: OpenAI GPT models
  - `anthropic.ts`: Claude models
  - `google.ts`: Gemini models
  - `mistral.ts`: Mistral models
  - `vercel.ts`: Vercel AI SDK integration
- **Error Handling**: Failover and fallback mechanisms

### Offline Mode

- Pre-written scenarios available
- No API key required
- Used as fallback when providers are unavailable

## Error Handling Best Practices

- **User-Friendly Messages**: Always extract meaningful error messages from Error objects before throwing new errors.
- **Fallback Handling**: Implement graceful fallbacks when LLM services are unavailable.
- **Logging**: Log errors for debugging while maintaining user privacy (never log API keys).
- **Toast Notifications**: Use toast notifications to inform users of connection issues or failures.

## Testing Guidelines

- **Test Runner**: No test runner is configured yet. When adding tests:
  - Use `*.test.ts`/`*.test.tsx` colocated with source or under `__tests__/`.
  - Prefer React Testing Library for components; mock `fetch` for provider calls.
  - Add a script `"test": "vitest"` (or Jest) and we'll run `pnpm test`.
- **Provider Testing**: Mock the provider layer in `src/lib/providers/` for unit tests.
- **Component Testing**: Test user interactions, accessibility, and responsive behavior.

## State Management

- **React Context**: Use contexts for global state (e.g., game state, settings).
- **Secrets Handling**: API keys stored in browser localStorage for user convenience.
- **State Updates**: Use immutable updates and avoid direct mutations.
- **Performance**: Implement proper dependency arrays in useEffect and useMemo.
- **Auto-save**: Settings are automatically saved when changed (rounds, choices, provider, model).
- **Custom Hooks**: `useSettings` hook manages all settings state and localStorage operations.
- **Optimized Updates**: Memoized context values to prevent unnecessary re-renders.

## Security & Configuration

- **API Keys**: Never commit, log, or transmit API keys. Store only in browser localStorage.
- **Environment Variables**: If introducing env vars, document them and add an `.env.example`.
- **Input Validation**: Validate all user inputs and API responses.
- **Error Boundaries**: Implement error boundaries for graceful failure handling.

## Recent Improvements & Best Practices

- **Provider Expansion**: Added support for Mistral as a direct API provider, plus Groq via AI SDK, along with AI SDK variants for all providers.
- **Error Handling**: Improved error handling across all LLM providers with meaningful error messages.
- **Model Selection**: Keep model lists simple with only essential properties (`value`).
- **Modal Layout**: Position action buttons logically in modal footers.
- **Button Styling**: Use semantic button variants for better visual hierarchy.
- **Code Cleanup**: Remove unused properties and simplify data structures.
- **Accessibility**: Improve focus management and keyboard navigation.
- **Code Refactoring**: Split large components into smaller, maintainable pieces.
- **Custom Hooks**: Extracted settings logic into reusable `useSettings` hook.
- **Constants Management**: Centralized provider data and model lists.
- **Type Safety**: Improved TypeScript types and interfaces.
- **Performance**: Fixed infinite re-render loops and optimized context updates.
- **Release Management**: Added automated release scripts with semantic versioning.

## Commit & Pull Request Guidelines

- **Commits**: Use imperative, concise subjects (e.g., `feat: add victory screen`, `refactor: simplify model lists`).
- **Conventional Commits**: Optionally follow Conventional Commits format for better changelog generation.
- **PRs**: Include clear description, linked issues, screenshots for UI changes, and test notes.
- **Scope**: Keep changes focused and incremental; avoid large, multi-feature PRs.
- **CI/Lint**: All checks must pass before merging; update documentation when behavior changes.

## Performance Considerations

- **Bundle Size**: Keep dependencies minimal and use tree-shaking effectively.
- **Lazy Loading**: Implement code splitting for route-based components.
- **Memoization**: Use React.memo, useMemo, and useCallback appropriately.
- **Image Optimization**: Use Next.js Image component for static assets.

## Documentation Standards

- **README**: Keep setup instructions clear and up-to-date.
- **Code Comments**: Document complex logic and non-obvious implementations.
- **Type Definitions**: Use descriptive names and add JSDoc comments for public APIs.
- **Changelog**: Document breaking changes and new features in `CHANGELOG.md`.

## Troubleshooting Common Issues

- **Build Errors**: Check TypeScript types and ensure all imports are correct.
- **Styling Issues**: Verify Tailwind classes and CSS variable usage.
- **Provider Errors**: Check API key configuration and network connectivity.
- **Performance Issues**: Monitor bundle size and implement proper memoization.

## Current Provider Status

### Direct API Providers

- **OpenAI**: GPT-5, GPT-4, GPT-3.5 models with custom model support
- **OpenRouter**: Access to multiple AI models through unified API
- **Anthropic**: Claude models (Opus, Sonnet, Haiku)
- **Google**: Gemini models with AI Studio integration
- **Mistral**: Mistral and Pixtral models
- **Vercel AI SDK**: Unified interface for multiple providers through Vercel AI SDK

### AI SDK Providers

- **OpenAI (AI SDK)**: Enhanced functionality through Vercel AI SDK
- **Anthropic (AI SDK)**: Claude models with AI SDK features
- **Google (AI SDK)**: Gemini models with AI SDK integration
- **Groq (AI SDK)**: Groq models with AI SDK capabilities
- **Mistral (AI SDK)**: Mistral models with AI SDK features
- **OpenRouter (AI SDK)**: OpenRouter models with AI SDK support

## 🚀 Quick Start for Agent

### Essential Files & Entry Points

- **Main App**: `src/app/page.tsx` - Home page and routing
- **Game State**: `src/contexts/game-context.tsx` - Central state management
- **AI Providers**: `src/lib/providers/` - AI integration layer
- **Game Logic**: `src/types/game.ts` - Core game type definitions
- **UI Components**: `src/components/` - Reusable components

### Key Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Production build
pnpm lint            # Code quality check
pnpm type-check      # TypeScript validation

# Testing (when implemented)
pnpm test            # Run unit tests
pnpm test:e2e        # End-to-end tests
```

## 🛠️ Common Agent Tasks

### Adding New AI Provider

1. Create provider class in `src/lib/providers/`
2. Implement base provider interface
3. Add to provider factory
4. Update provider selection UI
5. Test with sample requests

### Modifying Game Logic

1. Update types in `src/types/game.ts`
2. Modify game context in `src/contexts/game-context.tsx`
3. Update UI components in `src/components/pages/`
4. Test game flow end-to-end

### UI Component Updates

1. **Home Components**: `src/components/home/`
2. **Game Components**: `src/components/pages/`
3. **Reusable UI**: `src/components/ui/`
4. **Styling**: Use Tailwind classes, maintain design system

### Adding New Features

1. Define types and interfaces first
2. Update game context for state management
3. Create/update UI components
4. Add to routing if needed
5. Update documentation

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm build
```

#### API Key Issues

- Check localStorage for stored keys
- Verify provider endpoints
- Test with simple API calls
- Fallback to offline mode

#### Performance Issues

- Check bundle size with `pnpm build`
- Optimize images and assets
- Review component re-renders
- Use React DevTools Profiler

#### TypeScript Errors

```bash
# Check types
pnpm type-check

# Common fixes
- Update type definitions
- Add proper interfaces
- Fix import/export issues
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=true pnpm dev

# Check browser console for detailed logs
# Use React DevTools for component debugging
```

## 📋 Development Checklist

### Before Making Changes

- [ ] Read this documentation
- [ ] Understand current architecture
- [ ] Check existing implementations
- [ ] Plan component hierarchy

### Code Quality Standards

- [ ] TypeScript strict mode compliance
- [ ] ESLint rules followed
- [ ] Component props properly typed
- [ ] Error handling implemented
- [ ] Accessibility considerations

### Testing Requirements

- [ ] Unit tests for utilities
- [ ] Component tests for UI
- [ ] Integration tests for game flow
- [ ] E2E tests for critical paths

### Documentation Updates

- [ ] Update this AGENTS.md if architecture changes
- [ ] Add JSDoc comments for complex functions
- [ ] Update README if needed
- [ ] Document new AI providers

## 🎯 Agent Decision Framework

### When to Use AI vs Offline Mode

- **Use AI**: When user has valid API keys and wants dynamic content
- **Use Offline**: When no API keys, network issues, or for testing
- **Fallback**: Always have offline scenarios as backup

### Component Architecture Decisions

- **Context**: Use for global game state
- **Props**: Use for component-specific data
- **Local State**: Use for UI-only state
- **Custom Hooks**: Use for reusable logic

### Error Handling Strategy

1. **Graceful Degradation**: Always provide fallback options
2. **User Feedback**: Clear error messages and recovery steps
3. **Logging**: Detailed logs for debugging
4. **Retry Logic**: Automatic retries for transient failures

## 🔮 Future Development Notes

### Planned Features

- [ ] Multiplayer support
- [ ] Mobile app version
- [ ] Advanced AI story generation
- [ ] User accounts and progress saving
- [ ] Community features

### Technical Debt

- [ ] Add comprehensive testing suite
- [ ] Improve error recovery flows
- [ ] Optimize bundle size
- [ ] Add performance monitoring

### Architecture Evolution

- [ ] Consider micro-frontend architecture
- [ ] Implement service worker for offline
- [ ] Add real-time features with WebSockets
- [ ] Explore WebAssembly for performance

---

**Remember**: This is a treasure hunting game - keep the theme consistent and the adventure engaging! 🗺️💎
