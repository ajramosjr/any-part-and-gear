import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeVehicleAndParts(imageUrl: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are an automotive expert AI.
Identify the vehicle AND any visible automotive parts.
Return ONLY valid JSON.
`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
Analyze this image and return:
{
  "vehicle": {
    "year": number | null,
    "make": string | null,
    "model": string | null,
    "bodyType": string | null
  },
  "detectedParts": [
    {
      "name": string,
      "category": string,
      "condition": "new" | "used" | "unknown",
      "confidence": number
    }
  ],
  "notes": string
}
`
          },
          {
            type: "image_url",
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    temperature: 0.2
  });

  return JSON.parse(response.choices[0].message.content!);
}
