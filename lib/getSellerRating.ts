import { createClient } from "@/lib/supabase/server";

/**
 * Returns average seller rating rounded to 1 decimal
 */
export async function getSellerRating(sellerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  if (error) {
    console.error("Error fetching seller rating:", error);
    return 0;
  }

  if (!data || data.length === 0) return 0;

  const avg =
    data.reduce((sum, row) => sum + row.rating, 0) / data.length;

  return Math.round(avg * 10) / 10;
}
