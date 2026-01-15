import { supabase } from "@/lib/supabaseClient";

export async function deletePart(id: string) {
  const { error } = await supabase
    .from("parts")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
