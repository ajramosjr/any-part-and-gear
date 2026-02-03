import { createClient } from "@/lib/supabase/server";

/**
 * Returns Bronze | Silver | Gold
 */
export async function getSellerTier(sellerId: string) {
  const supabase = await createClient();

  // count completed trades
  const { count, error } = await supabase
    .from("trades")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", sellerId)
    .eq("status", "completed");

  if (error) {
    console.error("Error getting seller tier:", error);
    return "Bronze";
  }

  const completedTrades = count ?? 0;

  if (completedTrades >= 50) return "Gold";
  if (completedTrades >= 10) return "Silver";
  return "Bronze";
}
