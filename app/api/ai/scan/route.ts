import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

    /* ---------------------------------------
       1️⃣ AI Scan (mock for now)
    --------------------------------------- */

    const aiResult = {
      vehicle: "2018 Ford F-150",
      part: "Front bumper",
      condition: "Good",
      confidence: 0.78,
    };

    let confidence = aiResult.confidence;

    /* ---------------------------------------
       2️⃣ Check seller verification
    --------------------------------------- */

    const { data: seller } = await supabase
      .from("profiles")
      .select("verified")
      .eq("id", userId)
      .single();

    const sellerIsVerified = seller?.verified === true;

    if (sellerIsVerified) {
      confidence += 0.05;
    }

    confidence = Math.min(confidence, 1);

    /* ---------------------------------------
       3️⃣ Save AI scan result
    --------------------------------------- */

    const { error } = await supabase.from("ai_scans").insert({
      user_id: userId,
      image_url: imageUrl,
      vehicle: aiResult.vehicle,
      part: aiResult.part,
      condition: aiResult.condition,
      confidence,
      verified_boost: sellerIsVerified,
    });

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to save scan" },
        { status: 500 }
      );
    }

    /* ---------------------------------------
       4️⃣ Return result
    --------------------------------------- */

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
