import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeVehicle(imageUrl: string) {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: "Identify the vehicle in this image. Return JSON with make, model, year, bodyType, and confidence (0-1)." },
          { type: "input_image", image_url: imageUrl },
        ],
      },
    ],
  });

  return response.output_parsed ?? response.output_text;
}
