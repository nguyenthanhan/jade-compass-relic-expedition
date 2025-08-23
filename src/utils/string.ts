export function parseJSONResponse(text: string): any {
  try {
    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Invalid JSON response from LLM");
  }
}
