import { createClient } from "@/lib/supabaseServer";

export async function createPart(formData: FormData) {
  const supabase = createClient(); // ✅ NO ARGUMENTS

  const title = formData.get("title");

  await supabase.from("parts").insert({
    title,
  });
}
