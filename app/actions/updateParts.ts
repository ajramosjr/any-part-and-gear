"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function updatePart(id: string, formData: FormData) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString() || "";
  const price = Number(formData.get("price"));

  if (!title || !price) {
    redirect("/browse?error=Missing required fields");
  }

  const { error } = await supabase
    .from("parts")
    .update({ title, description, price })
    .eq("id", id);

  if (error) {
    redirect(`/browse?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/browse");
}
