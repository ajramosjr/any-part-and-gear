"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function deletePart(id: string) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from("parts").delete().eq("id", id);

  if (error) {
    redirect(`/browse?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/browse");
}
