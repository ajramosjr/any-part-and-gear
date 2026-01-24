import { createSupabaseServer } from "@/lib/supabaseServer";

export async function getSellerLevel(sellerId: string) {
  const supabase = createSupabaseServer();

  // completed sales
  const { count: sales } = await supabase
    .from("trades")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", sellerId)
    .eq("status", "completed");

  // seller rating
  const { data: reviews } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  const avgRating =
    reviews && reviews.length
      ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
      : 0;

  if ((sales ?? 0) >= 50 && avgRating >= 4.8) return "Elite Seller";
  if ((sales ?? 0) >= 10 && avgRating >= 4.5) return "Trusted Seller";
  if ((sales ?? 0) >= 3) return "Active Seller";

  return "New Seller";
}
