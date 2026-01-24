"use server";

import { createClient } from "@/lib/supabaseClient";

export async function deletePart(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("parts")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
