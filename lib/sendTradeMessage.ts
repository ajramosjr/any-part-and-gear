import { supabase } from "@/lib/supabaseClient";

export async function sendTradeMessage({
  tradeId,
  receiverId,
  message,
}: {
  tradeId: string;
  receiverId: string;
  message: string;
}) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase.from("trade_messages").insert({
    trade_id: tradeId,
    sender_id: user.id,
    receiver_id: receiverId,
    content: message,
  });

  if (error) {
    throw error;
  }
}
