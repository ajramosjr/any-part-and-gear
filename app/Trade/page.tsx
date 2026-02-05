"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/app/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";

type Trade = {
  id: number;
  part_id: number;
  sender_id: string;
  message: string;
  created_at: string;
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
        .from("trade_messages")
        .select("*")
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTrades(data);
      }

      setLoading(false);
    };

    fetchTrades();
  }, [supabase]);

  if (loading) {
    return <p className="p-6">Loading trade requests…</p>;
  }

  return (
    <RequireAuth>
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          Trade Requests
        </h1>

        {trades.length === 0 && (
          <p className="text-gray-500">
            No trade requests yet.
          </p>
        )}

        <div className="space-y-4">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="border rounded-lg p-4"
            >
              <p className="mb-2">{trade.message}</p>

              <p className="text-xs text-gray-500 mb-3">
                {new Date(trade.created_at).toLocaleString()}
              </p>

              <Link
                href={`/Trade/${trade.part_id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View conversation
              </Link>
            </div>
          ))}
        </div>
      </main>
    </RequireAuth>
  );
}
