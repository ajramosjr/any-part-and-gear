"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createPart(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title) {
    return { error: "Title is required" };
  }

  const { error } = await supabase.from("parts").insert([{ title }]);

if (error) {
  throw new Error(error.message);
}

redirect("/sell?success=1");
