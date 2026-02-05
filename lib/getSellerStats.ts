import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getSellerStats(sellerId: string) {
  const supabase = await createServerSupabaseClient();

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
