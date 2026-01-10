import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeVehicle(imageUrl: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Identify the vehicle in this image. Return make, model, year range, body type, and confidence." },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
  });

  return response.choices[0].message.content;
}
