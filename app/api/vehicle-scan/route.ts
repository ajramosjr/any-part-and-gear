import { NextResponse } from "next/server";
import { analyzeVehicleAndParts } from "@/lib/vehicleVision";

export async function POST(req: Request) {
  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image URL required" },
      { status: 400 }
    );
  }

  const result = await analyzeVehicleAndParts(imageUrl);

  return NextResponse.json({
    success: true,
    data: result
  });
}
