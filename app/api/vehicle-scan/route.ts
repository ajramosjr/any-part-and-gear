import { NextResponse } from "next/server";
import { analyzeVehicle } from "@/lib/vehicleVision";

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing imageUrl" },
        { status: 400 }
      );
    }

    if (!imageUrl.startsWith("http")) {
      return NextResponse.json(
        { error: "Invalid image URL" },
        { status: 400 }
      );
    }

    const result = await analyzeVehicle(imageUrl);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Vehicle AI error:", err);

    return NextResponse.json(
      { error: "AI scan failed" },
      { status: 500 }
    );
  }
}
