import { createClient } from "@/lib/supabase/server";

export async function getSellerStats(sellerId: string) {
  const supabase = await createClient();

  // total trades
  const { count: totalTrades } = await supabase
    .from("trades")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", sellerId);

  // completed trades
  const { count: completedTrades } = await supabase
    .from("trades")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", sellerId)
    .eq("status", "completed");

  // cancelled trades
  const { count: cancelledTrades } = await supabase
    .from("trades")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", sellerId)
    .eq("status", "cancelled");

  return {
    totalTrades: totalTrades ?? 0,
    completedTrades: completedTrades ?? 0,
    cancelledTrades: cancelledTrades ?? 0,
  };
}
