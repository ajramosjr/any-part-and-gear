import { createClient } from "@/lib/supabaseClient";
import { getTrustScore } from "@/lib/getTrustScore";
import { isVerifiedSeller } from "@/lib/isVerifiedSeller";

type Seller = {
  id: string;
  username: string | null;
};

type LeaderboardSeller = {
  id: string;
  username: string | null;
  trustScore: number;
  verified: boolean;
};

export async function getSellerLeaderboard(): Promise<LeaderboardSeller[]> {
  const supabase = createClient();

  const { data: sellers, error } = await supabase
    .from("profiles")
    .select("id, username");

  if (error || !sellers) {
    return [];
  }

  const leaderboard: LeaderboardSeller[] = [];

  for (const seller of sellers as Seller[]) {
    const trustScore = await getTrustScore(seller.id);
    const verified = await isVerifiedSeller(seller.id);

    leaderboard.push({
      id: seller.id,
      username: seller.username,
      trustScore,
      verified,
    });
  }

  return leaderboard.sort((a, b) => b.trustScore - a.trustScore);
}
