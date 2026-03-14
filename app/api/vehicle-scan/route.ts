import { NextResponse } from "next/server";
import { analyzeVehicle } from "@/lib/vehicleVision";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await analyzeVehicle(buffer);

    return NextResponse.json(result);

  } catch (err) {
    console.error("Vehicle AI error:", err);

    return NextResponse.json(
      { error: "AI scan failed" },
      { status: 500 }
    );
  }
}
