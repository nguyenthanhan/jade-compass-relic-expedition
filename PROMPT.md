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

- **Victory (clear all rounds):** Show **“Chúc mừng bạn đã tìm thấy một chiếc nồi.”**

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

  - Header: “Round i of X”
  - Cards styled like pixel-art panels with **title + summary**
  - Hover = pixel highlight, press = chiptune sound
  - Keyboard navigation (1..N) + ARIA roles

- **Transitions**

  - Success → fade or slide to next round
  - Failure → pixel-art “Game Over” overlay with failure summary

- **Victory Screen**

  - Treasure chest pixel animation opening
  - Display victory text + **Play Again**

- **Settings Drawer**

  - Accessible anytime
  - Change provider/model/key
  - Changes apply **from the next LLM call**

---

## Quality & Guardrails

- Accessibility: semantic HTML, ARIA roles, focus management, keyboard-only flow.
- Robust handling for: network errors, timeouts, malformed JSON.
- No sensitive data logging; never display or echo API keys.
- Narrative must always remain: **concise, vivid, treasure-hunt themed**.

---

## Deliverables

- **Production-ready Next.js app** implementing all requirements.
- **README**:

  - Setup & run instructions (using pnpm as package manager)
  - Provider config (OpenRouter, Gemini)
  - API key/model usage

- **Notes**:

  - Explain provider adapter design
  - JSON contract structure + how it maintains story continuity

  - Use pnpm for all dependency management
