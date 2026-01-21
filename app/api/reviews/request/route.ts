import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json();
  const { seller_id, part_id } = body;

  if (!seller_id || !part_id) {
    return NextResponse.json(
      { error: "Missing seller_id or part_id" },
      { status: 400 }
    );
  }

  // ✅ Use SERVICE ROLE client (NO cookies)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from("review_requests").insert({
    seller_id,
    part_id,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
