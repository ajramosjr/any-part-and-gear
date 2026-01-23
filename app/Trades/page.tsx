"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Trade = {
  id: string;
  message: string;
  status: string;
  parts: {
    title: string;
  }[];
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
        .select(`
          id,
          message,
          status,
          parts (
            title
          )
        `)
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTrades(data);
      }

      setLoading(false);
    };

    fetchTrades();
  }, []);

  if (loading) {
    return <p className="p-6">Loading trade requests…</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Trade Requests</h1>

      {trades.length === 0 && (
        <p className="text-gray-500">No trade requests yet.</p>
      )}

      {trades.map((trade) => (
        <div
          key={trade.id}
          className="border rounded-lg p-4 mb-4"
        >
          <h3 className="font-semibold text-lg">
            {trade.parts?.[0]?.title ?? "Unknown Part"}
          </h3>

          <p className="mt-2">{trade.message}</p>

          <p className="mt-2 text-sm text-gray-600">
            Status: <strong>{trade.status}</strong>
          </p>
        </div>
      ))}
    </main>
  );
}
