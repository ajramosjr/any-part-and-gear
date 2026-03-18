import "server-only";
import OpenAI from "openai";

export async function analyzeVehicle(imageData: string) {
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
            text: "Identify the vehicle and any visible parts. Return a JSON object with keys: vehicle, part, condition, confidence (0-1).",
          },
          {
            type: "image_url",
            image_url: { url: imageUrl, detail: "high" },
          },
        ],
      },
    ],
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content ?? "";
}
