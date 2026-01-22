import { supabase } from "@/lib/supabaseClient";

export async function isVerifiedSeller(sellerId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  if (error || !data || data.length < 5) {
    return false;
  }

  const avg =
    data.reduce((sum, r) => sum + r.rating, 0) / data.length;

  return avg >= 4.5;
}
