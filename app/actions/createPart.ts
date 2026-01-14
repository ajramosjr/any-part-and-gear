import { createClient } from "@/lib/supabaseServer";

export async function createPart(formData: FormData) {
  const supabase = await createClient(); // ✅ THIS IS THE FIX

  const title = formData.get("title");

  await supabase.from("parts").insert({
    title,
  });
}
