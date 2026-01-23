"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export type TradeMessage = {
  id: string;
  trade_request_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

export function useTradeChat(tradeRequestId: string) {
  const [messages, setMessages] = useState<TradeMessage[]>([]);
  const [loading, setLoading] = useState(true);
export async function sendTradeMessage(
  tradeRequestId: string,
  senderId: string,
  message: string
) {
  return supabase.from("trade_messages").insert({
    trade_request_id: tradeRequestId,
    sender_id: senderId,
    message,
  });
}
  useEffect(() => {
    if (!tradeRequestId) return;

    // 1️⃣ Load existing messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from("trade_messages")
        .select("*")
        .eq("trade_request_id", tradeRequestId)
        .order("created_at", { ascending: true });

      setMessages(data || []);
      setLoading(false);
    };

    loadMessages();

    // 2️⃣ Realtime subscription
    const channel = supabase
      .channel(`trade-chat-${tradeRequestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trade_messages",
          filter: `trade_request_id=eq.${tradeRequestId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as TradeMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tradeRequestId]);

  return { messages, loading };
}
