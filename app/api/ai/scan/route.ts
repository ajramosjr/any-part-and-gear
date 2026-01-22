import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { imageUrl, userId } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Identify the vehicle. Return JSON only:
{
  make,
  model,
  year,
  confidence
}`,
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
    });

    const raw = response.choices[0].message.content!;
    const data = JSON.parse(raw);

    await supabase.from("vehicle_scans").insert({
      user_id: userId,
      image_url: imageUrl,
      make: data.make,
      model: data.model,
      year: data.year,
      confidence: data.confidence,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "AI scan failed" },
      { status: 500 }
    );
  }
}
