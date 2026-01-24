import { createClient } from "@/lib/supabaseServer";

export async function hasMessaged(
  userId: string,
  otherUserId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("id")
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
    )
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error checking messages:", error);
    return false;
  }

  return !!data;
}
