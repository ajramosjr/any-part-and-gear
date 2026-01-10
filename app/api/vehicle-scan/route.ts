import { NextResponse } from "next/server";
import { analyzeVehicle } from "@/lib/vehicleVision";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

export async function POST(req: Request) {
  const { imageUrl } = await req.json();

  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await analyzeVehicle(imageUrl);

  return NextResponse.json({ result });
}
return Response.json({
  success: true,
  vehicle: {
    year: 2018,
    make: "Toyota",
    model: "Camry",
    trim: "SE",
    bodyType: "Sedan",
  },
  confidence: 0.86,
});
