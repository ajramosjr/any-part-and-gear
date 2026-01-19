import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const { error } = await supabase.from("messages").insert({
    sender_email: "buyer@guest.com",
    receiver_email: formData.get("receiver_email"),
    part_title: formData.get("part_title"),
    message: formData.get("message"),
  });
await supabase.from("messages").insert({
  sender_id: user.id,
  receiver_id: part.user_id,
  part_id: part.id,
  content: messageText,
});
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.redirect(new URL("/messages", req.url));
}
