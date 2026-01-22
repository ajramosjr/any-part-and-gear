"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Trade = {
  id: string;
  message: string;
  status: string;
  parts: { title: string };
};

export default function TradeRequestsPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("trade_requests")
        .select(`
          id,
          message,
          status,
          parts ( title )
        `)
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      setTrades(data || []);
      setLoading(false);
    };

    fetchTrades();
  }, []);

  if (loading) return <p>Loading trade requests...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Trade Requests</h1>

      {trades.length === 0 && <p>No trade requests</p>}

      {trades.map((trade) => (
        <div
          key={trade.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <h3>{trade.parts.title}</h3>
          <p>{trade.message}</p>
          <strong>Status: {trade.status}</strong>
        </div>
      ))}
    </div>
  );
}
