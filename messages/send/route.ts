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

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.redirect(new URL("/messages", req.url));
}
