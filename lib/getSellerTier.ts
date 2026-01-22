import { supabase } from "@/lib/supabaseClient";

export type SellerTier = "Bronze" | "Silver" | "Gold";

export async function getSellerTier(
  sellerId: string
): Promise<SellerTier> {
  const { data, error } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  if (error || !data || data.length === 0) {
    return "Bronze";
  }

  const count = data.length;
  const avg =
    data.reduce((sum, r) => sum + r.rating, 0) / count;

  if (avg >= 4.5 && count >= 10) return "Gold";
  if (avg >= 4.0 && count >= 5) return "Silver";

  return "Bronze";
}
