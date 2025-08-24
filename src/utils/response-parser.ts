import { get } from "lodash";
import {
  IFullStoryResponse,
  IGameRound,
  IChoice,
  INarrativeState,
} from "@/types/game";

/**
 * Parses a raw response object to IFullStoryResponse using lodash get
 * @param rawResponse - The raw response object from LLM
 * @returns Parsed IFullStoryResponse
 */
export function parseToFullStoryResponse(rawResponse: any): IFullStoryResponse {
  const intro = get(rawResponse, "intro", "");
  const overallTheme =
    get(rawResponse, "overallTheme") || get(rawResponse, "overall_theme", "");
  const roundsRaw = get(rawResponse, "rounds", []);
  const rounds = Array.isArray(roundsRaw)
    ? roundsRaw.map((round: any, index: number) => parseGameRound(round, index))
    : [];

  return {
    intro,
    overallTheme,
    rounds,
  };
}

function parseGameRound(round: any, index: number): IGameRound {
  const intro = get(round, "intro") || get(round, "description", "");
  const roundNumber = get(round, "round") || get(round, "id") || index + 1;
  const location = get(round, "location", "");
  const narrativeState = parseNarrativeState(round);
  const choicesRaw = get(round, "choices", []);
  const choices = Array.isArray(choicesRaw)
    ? choicesRaw.map((choice: any) => parseChoice(choice))
    : [];
  const failureSummary =
    get(round, "failureSummary") || get(round, "failure_summary");

  return {
    intro,
    round:
      typeof roundNumber === "string"
        ? Number.isFinite(parseInt(roundNumber, 10)) &&
          parseInt(roundNumber, 10) > 0
          ? parseInt(roundNumber, 10)
          : index + 1
        : Number.isFinite(roundNumber) && roundNumber > 0
        ? roundNumber
        : index + 1,
    location,
    narrativeState,
    choices,
    failureSummary,
  };
}

function parseNarrativeState(round: any): INarrativeState {
  const narrativeState =
    get(round, "narrativeState") || get(round, "narrative_state", {});
  const location = get(narrativeState, "location", "");
  const status = get(narrativeState, "status", "");
  const initItems =
    get(narrativeState, "initItems") ||
    get(narrativeState, "items") ||
    get(narrativeState, "init_items", []);
  const storyProgress =
    get(narrativeState, "storyProgress") ||
    get(narrativeState, "story_progress");

  return {
    location,
    status,
    initItems: Array.isArray(initItems)
      ? initItems.filter((item: any) => typeof item === "string")
      : [],
    storyProgress,
  };
}

function toBoolean(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    return s === "true" || s === "yes" || s === "y" || s === "1";
  }
  return false;
}

function parseChoice(choice: any): IChoice {
  const id = get(choice, "id", "");
  const title = get(choice, "title", "");
  const summary = get(choice, "summary", "");
  const isCorrectRaw =
    get(choice, "isCorrect") ??
    get(choice, "is_correct") ??
    get(choice, "correct");
  const isCorrect = toBoolean(isCorrectRaw);
  const consequence = get(choice, "consequence", "");
  const finalItems =
    get(choice, "finalItems") ||
    get(choice, "final_items") ||
    get(choice, "items", []);

  return {
    id,
    title,
    summary,
    isCorrect,
    consequence,
    finalItems: Array.isArray(finalItems)
      ? finalItems.filter((item: any) => typeof item === "string")
      : [],
  };
}
