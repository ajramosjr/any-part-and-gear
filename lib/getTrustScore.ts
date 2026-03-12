import { supabase } from "@/lib/supabaseClient";
import { isVerifiedSeller } from "@/lib/isVerifiedSeller";

export async function getTrustScore(sellerId: string): Promise<number> {
  let score = 0;

  // Reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  if (reviews && reviews.length > 0) {
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    score += avg * 20;
  }

  // Verified seller bonus
  const verified = await isVerifiedSeller(sellerId);
  if (verified) score += 20;

  return Math.min(score, 100);
}
