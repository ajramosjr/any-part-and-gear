import "server-only";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeVehicle(imageUrl: string) {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
      content: [
  {
    type: "input_text",
    text: "Identify the vehicle and visible parts in this image."
  },
  {
    type: "input_image",
    image_url: imageUrl,
    detail: "high"
  }
]
    ],
  });

  return response.output_text;
}
