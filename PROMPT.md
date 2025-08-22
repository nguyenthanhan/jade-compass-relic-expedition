# 🎮 _Jade Compass: Relic Expedition_

## Role & Goal

You are a **senior React/Next.js engineer** and **narrative designer**.
Build a small, replayable **treasure-hunter game** in Next.js (React) called **"Jade Compass: Relic Expedition"**
The theme must always remain **treasure hunting** — no other genres allowed.

---

## Core Gameplay

- On load, fetch a **random introduction** (1–2 sentences) from the chosen LLM provider.
- A game consists of **X rounds** (player-configurable: min 2, max 10).
- Each round shows **N choice cards** (configurable: min 2, max 5).
- Exactly **1 choice** is correct (advances story); others = fail (end run).
- Story continuity maintained via a compact **`narrative_state`** object.

### Narrative State (Minimal Schema)

```json
{
  "location": "string", // current place (e.g., ruins, cave, jungle)
  "status": "string", // short condition (e.g., healthy, injured, exhausted)
  "items": ["string"] // list of discovered or used items
}
```

Providers may extend with extra fields but must preserve this minimal schema.

### Victory & Failure

- **Victory (clear all rounds):** Show **"Congratulations! You have found the pot."**

- **Failure (wrong choice):** Show a **failure summary**, composed of:

  - `choices[i].consequence` of the losing choice
  - Recap of the path taken (titles of choices so far).

---

## LLM Data Source (Provider-Switchable)

- Implement an **adapter pattern** with methods:

  - `getRoundEvents(narrative_state, round, choicesCount)`

- Support **OpenRouter** and **Google Gemini** by default.
- UI lets user configure: **provider, API base, API key, model name**.
- Include **Test Connection** button + inline validation.
- Keys are **saved in `localStorage`** for convenience. Never persist on a server or log.
- LLM must return **strict JSON** only (no prose).

### JSON Contract

```json
{
  "intro": "string",        // only for first call
  "round": number,          // current round index
  "narrative_state": { ... },
  "choices": [
    {
      "id": "string",       // unique identifier
      "title": "string",    // short evocative label
      "summary": "string",  // 1–2 sentences outcome
      "is_correct": true,   // exactly one = true
      "consequence": "string" // short update affecting narrative_state
    }
  ],
  "failure_summary": "string (optional)" // only if run ends here
}
```

If the response is malformed or times out → fallback to **offline event pool**, show non-blocking toast + **Retry** option.

---

## Randomness & Session

- **Every new game resets** state.
- Use a **per-session seed**:

  - Required for offline event pool → ensures consistent single-run sequence.
  - Optional for LLM (applies only if provider supports deterministic seeding).

- Each new run must differ from previous (no reuse of past events).

---

## UX & UI — Retro 2D Pixel-Art Style

- Theme: **retro 2D pixel-art adventure**, inspired by classic RPGs.
- **Visual guidelines:**

  - Palette: earthy parchment tones (beige, brown), jade green highlights, muted gold for relics.
  - Font: pixelated retro style (e.g., _Press Start 2P_ or _VT323_).
  - Low-res textures, chiptune-inspired sound cues (optional).

### Screens

- **Home screen**

  - Pixelated logo + title
  - Provider/model/key settings
  - Input fields: Rounds (2–10), Choices per round (2–5)
  - **Start Game** button

- **In-game**

  - Header: "Round i of X"
  - Cards styled like pixel-art panels with **title + summary**
  - Hover = pixel highlight, press = chiptune sound
  - Keyboard navigation (1..N) + ARIA roles

- **Transitions**

  - Success → fade or slide to next round
  - Failure → pixel-art "Game Over" overlay with failure summary

- **Victory Screen**

  - Treasure chest pixel animation opening
  - Display victory text + **Play Again**

- **Settings Modal**

  - Accessible anytime
  - Change provider/model/key
  - Changes apply **from the next LLM call**
  - **Test Connection** button positioned in footer for better UX
  - **Streamlined model selection** with clean, minimal interface

---

## Quality & Guardrails

- Accessibility: semantic HTML, ARIA roles, focus management, keyboard-only flow.
- Robust handling for: network errors, timeouts, malformed JSON.
- No sensitive data logging; never display or echo API keys.
- Narrative must always remain: **concise, vivid, treasure-hunt themed**.

---

## Implementation Status

### ✅ Completed Features

- **Core Game Engine**: Round-based choice system with narrative state management
- **Provider Adapter Pattern**: OpenRouter and Google Gemini integration
- **Offline Fallback System**: Robust event pool with 8+ unique scenarios
- **Settings Management**: API key storage, provider selection, model configuration
- **UI/UX Improvements**:
  - Streamlined model lists (removed verbose labels/descriptions)
  - Integrated test connection button in modal footer
  - Enhanced button styling (destructive cancel, secondary test)
  - Better visual hierarchy and accessibility
- **Responsive Design**: Mobile and desktop compatible
- **Local Storage**: Secure API key management

### 🔄 Current Implementation

- **Model Lists**: Simplified to contain only `value` properties for cleaner interface
- **Modal Layout**: Test button moved to footer alongside cancel/save buttons
- **Button Styling**: Improved visual feedback with appropriate variants
- **Code Structure**: Clean, maintainable TypeScript with proper type safety

### 🎯 Available Models

**OpenRouter (Free Tier):**

- DeepSeek Chat V3, DeepSeek R1 0528, Kimi K2, Qwen 3 235B A22B
- Gemini 2.0 Flash Exp, MAI DS R1, Llama 3.3 70B Instruct
- GPT OSS 20B, Qwen 3 14B, Mistral variants, Gemma 3 27B IT, GLM 4.5 Air

**Google Gemini:**

- Gemini 2.5 Flash (default), Gemini 2.5 Pro, Gemini 2.0 Flash

---

## Deliverables

- **Production-ready Next.js app** implementing all requirements ✅
- **README**:

  - Setup & run instructions (using pnpm as package manager) ✅
  - Provider config (OpenRouter, Gemini) ✅
  - API key/model usage ✅
  - Recent updates and improvements ✅

- **Notes**:
  - Provider adapter design implemented with consistent interface ✅
  - JSON contract structure maintained for story continuity ✅
  - pnpm used for all dependency management ✅
  - UI/UX improvements completed for better user experience ✅

---

## Next Steps & Enhancements

- **Performance Optimization**: Implement caching for LLM responses
- **Additional Providers**: Support for more AI services (Claude, etc.)
- **Advanced Features**: Save/load game states, achievements system
- **Accessibility**: Screen reader optimization, high contrast mode
- **Internationalization**: Multi-language support for global players
