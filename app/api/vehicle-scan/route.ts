import { NextResponse } from "next/server";
import { analyzeVehicle } from "@/lib/vehicleVision";

export async function POST(req: Request) {
  const { imageUrl } = await req.json();

  const result = await analyzeVehicle(imageUrl);

  return NextResponse.json(result);
}
