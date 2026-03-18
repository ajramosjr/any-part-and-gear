import "server-only";
import OpenAI from "openai";

export type ScanResult = {
  vehicle: string;
  part: string;
  condition: string;
  confidence: number;
};

/** Parse AI text response to a structured object. The model may wrap JSON in
 *  markdown code fences (```json ... ```) so we strip those first. */
function parseAiResponse(text: string): ScanResult {
  // Strip markdown code fences if present
  const stripped = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  try {
    const parsed = JSON.parse(stripped);
    return {
      vehicle: String(parsed.vehicle ?? "Unknown vehicle"),
      part: String(parsed.part ?? "Unknown part"),
      condition: String(parsed.condition ?? "Unknown"),
      confidence: Math.min(1, Math.max(0, Number(parsed.confidence ?? 0))),
    };
  } catch {
    // If parsing fails, return a best-effort result with the raw text
    return {
      vehicle: "Unable to identify",
      part: "Unable to identify",
      condition: "Unknown",
      confidence: 0,
    };
  }
}

export async function analyzeVehicle(imageData: string): Promise<ScanResult> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  // Accept either a URL or base64 data; convert base64 to data URL if needed
  const imageUrl = imageData.startsWith("http")
    ? imageData
    : `data:image/jpeg;base64,${imageData}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: 'Identify the vehicle and any visible parts. Respond ONLY with a JSON object (no markdown, no explanation) with these exact keys: "vehicle" (string, e.g. "2018 Ford F-150"), "part" (string, e.g. "Front bumper"), "condition" (string: new/like-new/used/for-parts), "confidence" (number 0-1).',
          },
          {
            type: "image_url",
            image_url: { url: imageUrl, detail: "high" },
          },
        ],
      },
    ],
    max_tokens: 200,
  });

  const rawText = response.choices[0]?.message?.content ?? "";
  return parseAiResponse(rawText);
}
