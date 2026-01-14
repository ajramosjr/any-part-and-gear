import { createClient } from "@/lib/supabaseServer";

export async function deletePart(id: string) {
  const supabase = await createClient(); // ✅ NO ARGS, AWAIT IT

  await supabase
    .from("parts")
    .delete()
    .eq("id", id);
}
