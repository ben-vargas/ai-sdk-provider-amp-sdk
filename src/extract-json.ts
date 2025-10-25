/**
 * Extracts JSON from text content.
 * Handles both plain JSON and JSON wrapped in markdown code blocks.
 *
 * @param text - Text containing JSON
 * @returns Extracted JSON string
 */
export function extractJson(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Try to parse as-is first
  try {
    JSON.parse(text);
    return text;
  } catch {
    // Not valid JSON, continue with extraction
  }

  // Try markdown code blocks - use capture group to get content
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    const content = codeBlockMatch[1].trim();
    try {
      JSON.parse(content);
      return content;
    } catch {
      // Continue to other extraction methods
    }
  }

  // Try to find JSON object in text (greedy match)
  const jsonObjectRegex = /\{[\s\S]*\}/;
  const objectMatch = text.match(jsonObjectRegex);

  if (objectMatch) {
    const candidate = objectMatch[0];
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      // Continue
    }
  }

  // Try to find JSON array in text
  const jsonArrayRegex = /\[[\s\S]*\]/;
  const arrayMatch = text.match(jsonArrayRegex);

  if (arrayMatch) {
    const candidate = arrayMatch[0];
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      // Continue
    }
  }

  // If all else fails, return the original text
  return text;
}
