import { createBrowserClient } from "@supabase/ssr";

<<<<<<< HEAD
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
=======
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = 
  supabaseUrl,
  supabaseAnonKey
);
>>>>>>> 8b64255 (import { supabase } from "@/lib/supabaseClient";)
