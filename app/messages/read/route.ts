import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();
  const { part_id } = body;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("part_id", part_id)
    .eq("receiver_id", user.id)
    .eq("read", false);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  // ✅ THIS WAS THE BROKEN LINE
  return NextResponse.json({ success: true });
}
