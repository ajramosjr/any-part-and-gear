// app/actions/createPart.ts
// TEMP DISABLED – handled in browser Supabase until server auth is reintroduced

<<<<<<< HEAD
export async function createPart() {
  throw new Error(
    "createPart is temporarily disabled. Use browser Supabase instead."
=======
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export async function createPart(formData: FormData) {
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString() || "";
  const price = Number(formData.get("price"));

  if (!title || !price) {
    redirect("/sell?error=Missing required fields");
  }

  const supabase = 
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
>>>>>>> 8b64255 (import { supabase } from "@/lib/supabaseClient";)
  );
}
