import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getSellerLevel(sellerId: string) {
  const supabase = await createServerSupabaseClient();

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
