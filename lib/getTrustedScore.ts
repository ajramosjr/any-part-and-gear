import { supabase } from "@/lib/supabaseClient";
import { isVerifiedSeller } from "@/lib/isVerifiedSeller";

export async function getTrustScore(sellerId: string) {
  // ratings
  const { data: reviews } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  const avgRating =
    reviews && reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) /
        reviews.length
      : 0;

  // sales
  const { data: sales } = await supabase
    .from("purchases")
    .select("id")
    .eq("seller_id", sellerId);

  const salesCount = sales?.length || 0;

  // verified
  const verified = await isVerifiedSeller(sellerId);

  // scoring
  const ratingScore = Math.min(avgRating / 5, 1) * 50;
  const salesScore = Math.min(salesCount / 20, 1) * 30;
  const verifiedScore = verified ? 20 : 0;

  return Math.round(
    ratingScore + salesScore + verifiedScore
  );
}
