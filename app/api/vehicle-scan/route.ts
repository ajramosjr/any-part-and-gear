import { NextResponse } from "next/server";
import { analyzeVehicle } from "@/lib/vehicleVision";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image uploaded" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload JPEG, PNG, or WebP." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // analyzeVehicle now returns a parsed ScanResult object
    const result = await analyzeVehicle(base64Image);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Vehicle AI error:", err);

    return NextResponse.json(
      { error: "AI scan failed. Please try again." },
      { status: 500 }
    );
  }
}
