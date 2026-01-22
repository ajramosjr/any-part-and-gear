import { supabase } from "@/lib/supabaseClient";
import { getTrustScore } from "@/lib/getTrustScore";
import { isVerifiedSeller } from "@/lib/isVerifiedSeller";

export async function getSellerLeaderboard() {
  const { data: sellers } = await supabase
    .from("profiles")
    .select("id, username");

  if (!sellers) return [];

  const results = await Promise.all(
    sellers.map(async (s) => {
      const trust = await getTrustScore(s.id);
      const verified = await isVerifiedSeller(s.id);

      const { data: sales } = await supabase
        .from("purchases")
        .select("id")
        .eq("seller_id", s.id);

      return {
        id: s.id,
        username: s.username || "Seller",
        trust,
        verified,
        sales: sales?.length || 0,
      };
    })
  );

  return results.sort((a, b) => {
    if (b.trust !== a.trust) return b.trust - a.trust;
    if (b.verified !== a.verified) return Number(b.verified) - Number(a.verified);
    return b.sales - a.sales;
  });
}
