"use server";

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function createPart(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title) {
    throw new Error("Title is required");
  }

  const { error } = await supabase.from("parts").insert([
    { title }
  ]);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/"); // or wherever you want after submit
}
