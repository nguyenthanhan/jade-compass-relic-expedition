# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router entry (`layout.tsx`, `page.tsx`), global styles `globals.css`.
- `src/components/`: Reusable UI and page components (e.g., `components/ui/button.tsx`).
- `src/contexts/`: React context state (e.g., `game-context.tsx`).
- `src/hooks/`: Custom hooks (e.g., `use-round-data.ts`).
- `src/lib/`: Utilities and providers (LLM adapters in `lib/providers/*`).
- `src/types/`: Shared TypeScript types (e.g., `types/game.ts`).
- `public/`: Static assets. Build output lives in `.next/`.

## Build, Test, and Development Commands
- `pnpm dev`: Start the local dev server at `http://localhost:3000`.
- `pnpm build`: Production build.
- `pnpm start`: Run the built app.
- `pnpm lint`: Run Next.js/ESLint checks.
Tip: npm equivalents exist (e.g., `npm run dev`), but this repo uses `pnpm`.

## Coding Style & Naming Conventions
- TypeScript strict mode; prefer explicit types for public APIs.
- Indentation: 2 spaces; no semicolons required by tooling is fine.
- File names: kebab-case (e.g., `game-context.tsx`, `openrouter-provider.ts`).
- React components: PascalCase component names inside lower-case files; default export when a file holds a single component.
- Hooks: prefix with `use-` and return typed values.
- Imports: prefer `@/` alias for code under `src/`.
- Styling: Tailwind CSS utilities in `globals.css` and component classes; avoid inline styles.

## Testing Guidelines
- No test runner is configured yet. When adding tests:
  - Use `*.test.ts`/`*.test.tsx` colocated with source or under `__tests__/`.
  - Prefer React Testing Library for components; mock `fetch` for provider calls.
  - Add a script `"test": "vitest"` (or Jest) and we’ll run `pnpm test`.

## Commit & Pull Request Guidelines
- Commits: imperative, concise subjects (e.g., `feat: add victory screen`). Optionally follow Conventional Commits.
- PRs: include clear description, linked issues, screenshots for UI, and test notes. Keep changes scoped and incremental.
- CI/lint must pass; update docs when behavior or commands change.

## Security & Configuration Tips
- API keys for LLM providers are entered at runtime and are not persisted. Do not commit keys or log them.
- Avoid network calls in tests; mock provider layers in `src/lib/providers/`.
- If introducing env vars, document them and add an `.env.example`.
