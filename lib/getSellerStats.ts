import { supabase } from "@/lib/supabaseClient";

export async function getSellerStats(sellerId: string) {
  const { data, error } = await supabase
    .from("parts")
    .select("id")
    .eq("user_id", sellerId);

  if (error || !data) {
    return {
      totalListings: 0,
    };
  }

  return {
    totalListings: data.length,
  };
}
