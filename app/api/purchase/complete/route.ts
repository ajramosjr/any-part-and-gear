import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { buyerId, sellerId, partId } = await req.json();

  // 1️⃣ Record purchase
  const { error: purchaseError } = await supabase
    .from("purchases")
    .insert({
      buyer_id: buyerId,
      seller_id: sellerId,
      part_id: partId,
    });

  if (purchaseError) {
    return NextResponse.json(
      { error: "Purchase failed" },
      { status: 500 }
    );
  }

  // 2️⃣ Auto-request review
  await supabase.from("messages").insert({
    sender_id: sellerId,
    receiver_id: buyerId,
    part_id: partId,
    type: "review_request",
    content: "Thanks for your purchase! Please leave a review.",
    read: false,
  });

  return NextResponse.json({ success: true });
}
