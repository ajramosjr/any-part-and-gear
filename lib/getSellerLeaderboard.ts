import { supabase } from "@/lib/supabaseClient";
import { getTrustScore } from "@/lib/getTrustScore";
import { isVerifiedSeller } from "@/lib/isVerifiedSeller";

export async function getSellerLeaderboard() {
  const { data: sellers, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) {
    console.error("Leaderboard error:", error.message);
    return [];
  }

  const leaderboard = await Promise.all(
    sellers.map(async (seller) => {
      const trustScore = await getTrustScore(seller.id);
      const verified = await isVerifiedSeller(seller.id);

      return {
        ...seller,
        trustScore,
        verified,
      };
    })
  );

  return leaderboard.sort((a, b) => b.trustScore - a.trustScore);
}
