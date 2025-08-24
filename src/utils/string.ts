export function parseJSONResponse<T = unknown>(text: string): T {
  // Prefer fenced JSON; fall back to raw trimmed text.
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = (fenceMatch ? fenceMatch[1] : text).trim();
  try {
    return JSON.parse(candidate) as T;
  } catch {
    const preview =
      text.length > 2000 ? text.slice(0, 2000) + "…(truncated)" : text;
    console.error("Failed to parse JSON response:", preview);
    throw new Error("Invalid JSON response from LLM");
  }
}
