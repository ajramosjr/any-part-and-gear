import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const formData = await req.formData();

  await supabase.from("messages").insert({
    sender_email: "buyer@guest.com", // later: auth user
    receiver_email: formData.get("receiver_email"),
    part_title: formData.get("part_title"),
    message: formData.get("message"),
  });

  return NextResponse.redirect(new URL("/messages", req.url));
}
