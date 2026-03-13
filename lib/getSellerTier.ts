import { supabase } from "@/lib/supabaseClient";

/**
 * Returns Bronze | Silver | Gold
 */
export async function getSellerTier(sellerId: string) {

  // total listings
  const { data: parts } = await supabase
    .from("parts")
    .select("id")
    .eq("seller_id", sellerId);

  const totalListings = parts?.length ?? 0;

  // average rating
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (totalListings >= 25 && avgRating >= 4.5) return "Gold";
  if (totalListings >= 10 && avgRating >= 4.0) return "Silver";

  return "Bronze";
}
