import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Returns average seller rating rounded to 1 decimal
 */
export async function getSellerRating(sellerId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  if (error || !data || data.length === 0) {
    return null;
  }

  const avg =
    data.reduce((sum, r) => sum + r.rating, 0) / data.length;

  return Math.round(avg * 10) / 10;
}
