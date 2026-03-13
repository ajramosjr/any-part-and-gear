import { supabase } from "@/lib/supabaseClient";

export async function hasMessaged(
  userId: string,
  partId: number
): Promise<boolean> {
  const { data, error } = await supabase
    .from("trade_messages")
    .select("id")
    .eq("part_id", partId)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .limit(1);

  if (error) {
    console.error("hasMessaged error:", error.message);
    return false;
  }

  return (data?.length ?? 0) > 0;
}
