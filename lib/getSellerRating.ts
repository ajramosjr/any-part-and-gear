import { supabase } from "@/lib/supabaseClient";

/**
 * Returns average seller rating rounded to 1 decimal
 */
export async function getSellerRating(sellerId: string): Promise<number> {
  const { data, error } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  if (error || !data || data.length === 0) {
    return 0;
  }

  const total = data.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / data.length) * 10) / 10;
}
