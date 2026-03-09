"use server";

import { createClient } from "@supabase/supabase-js";

export async function deletePart(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("parts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error.message);
    throw new Error("Failed to delete part");
  }

  return { success: true };
}
