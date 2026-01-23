"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Trade = {
  id: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  parts: {
    title: string;
  } | null;
};

export default function TradeRequestsPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("trade_requests")
        .select(
          `
          id,
          message,
          status,
          parts ( title )
        `
        )
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setTrades(data || []);
      }

      setLoading(false);
    };

    fetchTrades();
  }, []);

  const updateStatus = async (
    tradeId: string,
    status: "accepted" | "declined"
  ) => {
    await supabase
      .from("trade_requests")
      .update({ status })
      .eq("id", tradeId);

    setTrades((prev) =>
      prev.map((trade) =>
        trade.id === tradeId ? { ...trade, status } : trade
      )
    );
  };

  if (loading) return <p>Loading trade requests...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 700 }}>
      <h1>Trade Requests</h1>

      {trades.length === 0 && <p>No trade requests yet.</p>}

      {trades.map((trade) => (
        <div
          key={trade.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 14,
            marginBottom: 14,
          }}
        >
          <h3>{trade.parts?.title ?? "Unknown Part"}</h3>
          <p>{trade.message}</p>

          <p>
            <strong>Status:</strong>{" "}
            {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
          </p>

          {trade.status === "pending" && (
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => updateStatus(trade.id, "accepted")}
                style={{
                  marginRight: 8,
                  padding: "6px 10px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(trade.id, "declined")}
                style={{
                  padding: "6px 10px",
                  background: "crimson",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                Decline
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
