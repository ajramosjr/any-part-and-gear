import { supabase } from "@/lib/supabaseClient";

export async function getSellerStats(sellerId: string) {
  const { data, error } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  if (error || !data || data.length === 0) {
    return {
      average: null,
      count: 0,
      isTopSeller: false,
    };
  }

  const count = data.length;
  const average =
    data.reduce((sum, r) => sum + r.rating, 0) / count;

  return {
    average: Number(average.toFixed(2)),
    count,
    isTopSeller: average >= 4.5 && count >= 5,
  };
}
