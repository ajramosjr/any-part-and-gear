import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { buyerId, sellerId, partId } = await req.json();

    if (!buyerId || !sellerId || !partId) {
      return NextResponse.json(
        { error: "Missing buyerId, sellerId, or partId" },
        { status: 400 }
      );
    }

    if (buyerId === sellerId) {
      return NextResponse.json(
        { error: "Buyer cannot be the seller" },
        { status: 400 }
      );
    }

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
        { error: purchaseError.message },
        { status: 500 }
      );
    }

    // 2️⃣ Send review request message
    const { error: messageError } = await supabase
      .from("messages")
      .insert({
        sender_id: sellerId,
        receiver_id: buyerId,
        part_id: partId,
        type: "review_request",
        content: "Thanks for your purchase! Please leave a review.",
        read: false,
      });

    if (messageError) {
      console.error("Review message error:", messageError);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Purchase API error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
