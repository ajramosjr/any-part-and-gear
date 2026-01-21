import { supabase } from "@/lib/supabaseClient";

export async function getSellerLevel(sellerId: string) {
  // completed sales
  const { count: sales } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", sellerId)
    .eq("status", "completed");

  // average rating
  const { data: reviews } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  const avgRating =
    reviews && reviews.length
      ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
      : 0;

  if ((sales ?? 0) >= 15 && avgRating >= 4.5) return "Gold";
  if ((sales ?? 0) >= 5 && avgRating >= 4.0) return "Silver";
  return "Bronze";
}
