# Repository Guidelines

## Project Structure & Module Organization

- `src/app/`: Next.js App Router entry (`layout.tsx`, `page.tsx`), global styles `globals.css`.
- `src/components/`: Reusable UI and page components (e.g., `components/ui/button.tsx`).
- `src/components/pages/`: Page-specific components (e.g., `home.tsx`, game components).
- `src/components/home/`: Home page components split into smaller, maintainable pieces.
- `src/contexts/`: React context state (e.g., `game-context.tsx`).
- `src/hooks/`: Custom hooks (e.g., `use-settings.ts`, `use-round-data.ts`).
- `src/lib/`: Utilities and providers (LLM adapters in `lib/providers/*`).
- `src/types/`: Shared TypeScript types (e.g., `types/game.ts`).
- `public/`: Static assets. Build output lives in `.next/`.

## Build, Test, and Development Commands

- `pnpm dev`: Start the local dev server at `http://localhost:3000`.
- `pnpm build`: Production build.
- `pnpm start`: Run the built app.
- `pnpm lint`: Run Next.js/ESLint checks.

**Tip**: npm equivalents exist (e.g., `npm run dev`), but this repo uses `pnpm` as the primary package manager.

## Coding Style & Naming Conventions

- **TypeScript**: Strict mode enabled; prefer explicit types for public APIs.
- **Indentation**: 2 spaces; no semicolons required by tooling is fine.
- **File names**: kebab-case (e.g., `game-context.tsx`, `openrouter-provider.ts`).
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

## LLM Provider Development

- **Adapter Pattern**: All providers must implement the same interface for consistency.
- **Error Handling**: Implement robust fallback to offline mode on failures with clear error messages.
- **Type Safety**: Use strict typing for provider responses and error states.
- **Testing**: Mock network calls in tests; avoid real API calls during development.
- **Provider Support**: Currently supports OpenAI, OpenRouter, Anthropic, and Google Gemini.
- **API Base URLs**: Use correct API endpoints from centralized constants.
- **CORS Handling**: Proper CORS configuration for cross-origin requests.
- **Error Messages**: Provide meaningful error messages in `testConnection()` and other methods for better user experience.

## Error Handling Best Practices

- **User-Friendly Messages**: Always extract meaningful error messages from Error objects before throwing new errors.
- **Consistent Pattern**: Use the established pattern for error handling across all providers:
  ```typescript
  const errorMessage = error instanceof Error ? error.message : String(error);
  throw new Error(`${errorMessage}`);
  ```
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

- **Error Handling**: Improved error handling across all LLM providers with meaningful error messages
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
- **Changelog**: Document breaking changes and new features.

## Troubleshooting Common Issues

- **Build Errors**: Check TypeScript types and ensure all imports are correct.
- **Styling Issues**: Verify Tailwind classes and CSS variable usage.
- **Provider Errors**: Check API key configuration and network connectivity.
- **Performance Issues**: Monitor bundle size and implement proper memoization.

---

**Remember**: This is a treasure hunting game - keep the theme consistent and the adventure engaging! 🗺️💎
