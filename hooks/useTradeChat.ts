"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type TradeMessage = {
  id: string;
  message: string;
  sender_id: string;
  created_at: string;
};

export function useTradeChat(tradeId: string) {
  const [messages, setMessages] = useState<TradeMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("trade_messages")
        .select("*")
        .eq("trade_id", tradeId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }

      setLoading(false);
    };

    fetchMessages();

    const channel = supabase
      .channel(`trade-chat-${tradeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trade_messages",
          filter: `trade_id=eq.${tradeId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as TradeMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tradeId]);

  return { messages, loading };
}
