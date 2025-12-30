"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createPart(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title) {
    throw new Error("Title is required");
  }

  const { error } = await supabase.from("parts").insert([
    { title }
  ]);

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(error.message);
  }

  redirect("/");
}
