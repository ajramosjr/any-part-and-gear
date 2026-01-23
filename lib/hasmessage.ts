import { supabase } from "@/lib/supabaseClient";

export async function hasMessaged(
  userId: string,
  sellerId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("messages")
    .select("id")
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${sellerId}),
       and(sender_id.eq.${sellerId},receiver_id.eq.${userId})`
    )
    .limit(1);

  if (error) {
    console.error(error);
    return false;
  }

  return (data?.length ?? 0) > 0;
}
