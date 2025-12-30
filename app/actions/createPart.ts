"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createPart(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title) {
    return { error: "Title is required" };
  }

  const { error } = await supabase.from("parts").insert([
    { title },
  ]);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
