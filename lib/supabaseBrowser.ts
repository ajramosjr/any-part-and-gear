import { createBrowserClient } from "@supabase/ssr";

<<<<<<< HEAD
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
=======
export const supabase = 
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
>>>>>>> 8b64255 (import { supabase } from "@/lib/supabaseClient";)
