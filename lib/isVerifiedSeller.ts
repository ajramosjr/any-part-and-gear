import { createClient } from "@/lib/supabaseClient";

export async function isVerifiedSeller(sellerId: string): Promise<boolean> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("parts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", sellerId)
    .eq("sold", true);

  if (error) {
    return false;
  }

  // Example rule: verified if 5+ completed sales
  return (count ?? 0) >= 5;
}
