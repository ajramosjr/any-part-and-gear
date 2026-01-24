import { createClient } from "@/lib/supabaseClient";
import { isVerifiedSeller } from "@/lib/isVerifiedSeller";

export async function getTrustScore(sellerId: string): Promise<number> {
  const supabase = createClient();

  const { data: listings, error } = await supabase
    .from("parts")
    .select("id")
    .eq("user_id", sellerId);

  if (error || !listings) {
    return 0;
  }

  let score = listings.length * 10;

  const verified = await isVerifiedSeller(sellerId);
  if (verified) {
    score += 50;
  }

  return score;
}
