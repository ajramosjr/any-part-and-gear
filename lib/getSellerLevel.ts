import { supabase } from "@/lib/supabaseClient";

export async function getSellerLevel(sellerId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("seller_level")
    .eq("id", sellerId)
    .single();

  if (error || !data) {
    return "new";
  }

  return data.seller_level;
}
