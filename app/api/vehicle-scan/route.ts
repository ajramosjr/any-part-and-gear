import { NextResponse } from "next/server";
import { analyzeVehicle } from "@/lib/vehicleVision";
import { createClient } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await analyzeVehicle(imageUrl);

    return NextResponse.json({
      success: true,
      vehicle: {
        year: result.year,
        make: result.make,
        model: result.model,
        bodyType: result.bodyType,
      },
      confidence: result.confidence,
    });
  } catch (error) {
    console.error("Vehicle scan error:", error);
    return NextResponse.json(
      { error: "Vehicle scan failed" },
      { status: 500 }
    );
  }
}
