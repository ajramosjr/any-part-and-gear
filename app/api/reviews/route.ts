import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { sellerId, buyerId, partId, rating, comment } =
    await req.json();

  // 1️⃣ Prevent self-review
  if (sellerId === buyerId) {
    return NextResponse.json(
      { error: "You cannot review yourself." },
      { status: 403 }
    );
  }

  // 2️⃣ Confirm purchase
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("buyer_id", buyerId)
    .eq("part_id", partId)
    .single();

  if (!purchase) {
    return NextResponse.json(
      { error: "You must purchase before reviewing." },
      { status: 403 }
    );
  }

  // 3️⃣ Insert review (duplicate blocked by DB constraint)
  const { error } = await supabase.from("seller_reviews").insert({
    seller_id: sellerId,
    buyer_id: buyerId,
    part_id: partId,
    rating,
    comment,
  });

  if (error) {
    return NextResponse.json(
      { error: "Review already submitted." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
