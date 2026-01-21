import { supabase } from "@/lib/supabaseClient";

export async function getSellerRating(sellerId: string) {
  const { data } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  if (!data || data.length === 0) {
    return { avg: null, count: 0 };
  }

  const total = data.reduce((sum, r) => sum + r.rating, 0);
  const avg = total / data.length;

  return {
    avg: Number(avg.toFixed(1)),
    count: data.length,
  };
}
