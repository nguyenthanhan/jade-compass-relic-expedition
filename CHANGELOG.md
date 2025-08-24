# Changelog

All notable changes to the Jade Compass: Relic Expedition project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-08-25

### Added

- Core game engine with round-based choice system
- LLM provider adapter pattern supporting OpenAI, OpenRouter, Anthropic, and Google Gemini
- Offline fallback system with robust event pool
- Settings management with API key storage and provider selection
- Retro pixel-art UI with responsive design

### Changed

- Refactored home page into smaller, maintainable components
- Implemented custom `useSettings` hook for centralized settings management
- Centralized provider data and model lists for consistency

### Fixed

- Infinite re-render loops in React context
- CORS configuration issues with API endpoints
- Performance issues with context updates

---

_This changelog will be updated with each new release to document all changes, improvements, and new features._
