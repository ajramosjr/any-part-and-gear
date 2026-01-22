import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { buyerId, sellerId, partId } = await req.json();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from("review_requests").insert({
    buyer_id: buyerId,
    seller_id: sellerId,
    part_id: partId,
  });

  return NextResponse.json({ success: true });
}
