import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { analyzeVehicle } from "@/lib/vehicleVision";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl, userId } = body;

    if (!imageUrl || !userId) {
      return NextResponse.json(
        { error: "Missing imageUrl or userId" },
        { status: 400 }
      );
    }

    // Server-only Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    /* -----------------------------------------------
       1️⃣ Real AI scan via OpenAI vision
    ----------------------------------------------- */
    const aiResult = await analyzeVehicle(imageUrl);

    let { confidence } = aiResult;

    /* -----------------------------------------------
       2️⃣ Check seller verification for confidence boost
    ----------------------------------------------- */
    const { data: seller } = await supabase
      .from("profiles")
      .select("verified")
      .eq("id", userId)
      .maybeSingle();

    const sellerIsVerified = seller?.verified === true;

    if (sellerIsVerified) {
      confidence = Math.min(1, confidence + 0.05);
    }

    /* -----------------------------------------------
       3️⃣ Save AI scan result to database
    ----------------------------------------------- */
    const { error: insertError } = await supabase.from("ai_scans").insert({
      user_id: userId,
      image_url: imageUrl,
      vehicle: aiResult.vehicle,
      part: aiResult.part,
      condition: aiResult.condition,
      confidence,
      verified_boost: sellerIsVerified,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      // Non-fatal — still return the result even if save fails
    }

    /* -----------------------------------------------
       4️⃣ Return result
    ----------------------------------------------- */
    return NextResponse.json({
      vehicle: aiResult.vehicle,
      part: aiResult.part,
      condition: aiResult.condition,
      confidence,
      verifiedBoostApplied: sellerIsVerified,
    });
  } catch (err) {
    console.error("AI Scan Error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
