import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  await supabase.from("parts").delete().eq("id", params.id);

  return NextResponse.redirect(new URL("/parts", req.url));
}
