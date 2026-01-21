import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { sellerId, rating, comment } = await req.json();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  // 🚫 Block self-reviews
  if (user.id === sellerId) {
    return NextResponse.json(
      "You cannot review yourself",
      { status: 403 }
    );
  }

  // ✅ Must have messaged seller
  const { data } = await supabase
    .from("messages")
    .select("id")
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${sellerId}),
       and(sender_id.eq.${sellerId},receiver_id.eq.${user.id})`
    )
    .limit(1);

  if (!data || data.length === 0) {
    return NextResponse.json(
      "You must message the seller before reviewing",
      { status: 403 }
    );
  }

  // ✅ Insert review
  const { error } = await supabase.from("seller_reviews").insert({
    seller_id: sellerId,
    reviewer_id: user.id,
    rating,
    comment,
  });

  if (error) {
    return NextResponse.json(error.message, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
