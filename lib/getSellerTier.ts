import { supabase } from "@/lib/supabaseClient";

/**
 * Returns Bronze | Silver | Gold
 */
export async function getSellerTier(sellerId: string) {
  const { data } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  if (!data || data.length === 0) return "Bronze";

  const avg =
    data.reduce((sum, r) => sum + r.rating, 0) / data.length;

  if (avg >= 4.8 && data.length >= 20) return "Gold";
  if (avg >= 4.2 && data.length >= 5) return "Silver";
  return "Bronze";
}
