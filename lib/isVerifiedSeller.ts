import { supabase } from "@/lib/supabaseClient";

export async function isVerifiedSeller(sellerId: string) {
  // total sales
  const { data: sales } = await supabase
    .from("purchases")
    .select("id")
    .eq("seller_id", sellerId);

  if (!sales || sales.length < 10) return false;

  // ratings
  const { data: reviews } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  if (!reviews || reviews.length === 0) return false;

  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) /
    reviews.length;

  return avg >= 4.5;
}
