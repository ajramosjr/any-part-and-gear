"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/app/components/RequireAuth";
import { createClient } from "@/lib/supabaseClient";

type Trade = {
  id: number;
  part_id: number;
  offer_text: string;
  status: string;
  created_at: string;
};

export default function TradeRequestsPage() {
  const supabase = createClient();

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
        .from("trades")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTrades(data);
      }

      setLoading(false);
    };

    fetchTrades();
  }, [supabase]);

  return (
    <RequireAuth>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Trade Requests</h1>

        {loading && <p>Loading…</p>}

        {!loading && trades.length === 0 && (
          <p className="text-gray-500">No trade requests yet.</p>
        )}

        <ul className="space-y-4">
          {trades.map((trade) => (
            <li
              key={trade.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">Offer:</p>
                <p className="text-sm text-gray-600">{trade.offer_text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Status: {trade.status}
                </p>
              </div>

              <Link
                href={`/Trade/${trade.part_id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </RequireAuth>
  );
}
