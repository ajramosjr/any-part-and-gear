import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { buyerId, sellerId, partId } = await req.json();

  if (!buyerId || !sellerId || !partId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  // Server-only Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Prevent self-reviews
  if (buyerId === sellerId) {
    return NextResponse.json(
      { error: "You cannot review yourself" },
      { status: 403 }
    );
  }

  // Verify purchase
  const { data: purchase } = await supabase
    .from("orders")
    .select("id")
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId)
    .eq("part_id", partId)
    .single();

  if (!purchase) {
    return NextResponse.json(
      { error: "Purchase not found" },
      { status: 403 }
    );
  }

  return NextResponse.json({ allowed: true });
}
