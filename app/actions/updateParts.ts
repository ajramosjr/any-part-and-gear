import { createClient } from "@/lib/supabaseServer";

export async function updatePart(id: string, formData: FormData) {
  const supabase = await createClient(); // ✅ NO ARGS

  const title = formData.get("title");

  await supabase
    .from("parts")
    .update({ title })
    .eq("id", id);
}
