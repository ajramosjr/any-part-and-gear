"use server";

import { supabase } from "@/lib/supabaseClient";

export async function deletePart(id: string) {
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
