"use server";

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function createPart(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title) {
    redirect("/sell?error=Title is required");
  }

  const { error } = await supabase.from("parts").insert([{ title }]);

  if (error) {
    redirect(`/sell?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/sell?success=1");
}
