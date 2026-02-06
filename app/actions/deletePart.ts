"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function deletePart(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("parts")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
