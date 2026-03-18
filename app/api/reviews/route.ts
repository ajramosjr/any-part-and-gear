import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { sellerId, buyerId, partId, rating, comment } =
      await req.json();

    if (!sellerId || !buyerId || !partId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (sellerId === buyerId) {
      return NextResponse.json(
        { error: "You cannot review yourself." },
        { status: 403 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    const { data: purchase, error: purchaseError } =
      await supabase
        .from("purchases")
        .select("id")
        .eq("buyer_id", buyerId)
        .eq("part_id", partId)
        .single();

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: "You must purchase before reviewing." },
        { status: 403 }
      );
    }

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
  } catch (err) {
    console.error("Review error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
