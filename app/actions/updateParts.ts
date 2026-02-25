// app/actions/updateParts.ts
// TEMP DISABLED – handled in client until server auth is reintroduced

<<<<<<< HEAD
export async function updatePart() {
  throw new Error(
    "updatePart is temporarily disabled. Use browser Supabase instead."
=======
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function updatePart(id: string, formData: FormData) {
  const supabase = 
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
>>>>>>> 8b64255 (import { supabase } from "@/lib/supabaseClient";)
  );
}
