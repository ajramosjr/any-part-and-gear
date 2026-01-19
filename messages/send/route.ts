import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const { receiver_id, part_id, content } = body;

  // ✅ GET AUTH USER PROPERLY
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    receiver_id,
    part_id,
    content,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
