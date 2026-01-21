import { supabase } from "@/lib/supabaseClient";

export async function getSellerRating(sellerId: string) {
  const { data, error } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  if (error || !data || data.length === 0) {
    return null;
  }

  const avg =
    data.reduce((sum, r) => sum + r.rating, 0) / data.length;

  return Number(avg.toFixed(1));
}
