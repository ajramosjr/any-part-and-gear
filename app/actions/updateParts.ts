"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function updatePart(
  id: string,
  updates: {
    title?: string;
    price?: number;
    description?: string;
    condition?: string;
    location?: string;
  }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("parts")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Update error:", error.message);
    throw new Error("Failed to update part");
  }

  revalidatePath(`/parts/${id}`);
  revalidatePath("/my-listings");

  return { success: true };
}
