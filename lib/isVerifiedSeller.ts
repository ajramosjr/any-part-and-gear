import { createClient } from "@/lib/supabaseClient";

export async function isVerifiedSeller(
  sellerId: string
): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("verified")
    .eq("id", sellerId)
    .single();

  if (error) return false;

  return data?.verified === true;
}
