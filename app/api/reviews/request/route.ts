import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { buyerId, sellerId, partId } = await req.json();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies }
  );

  await supabase.from("messages").insert({
    sender_id: null,
    receiver_id: buyerId,
    part_id: partId,
    content:
      "✅ Purchase completed! Please leave a review for the seller to help build trust in the marketplace.",
  });

  return NextResponse.json({ success: true });
}
