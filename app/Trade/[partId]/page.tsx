"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RequireAuth from "@/app/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";

export default function TradeOfferPage() {
  const router = useRouter();
  const params = useParams();

  const partId = params.partId as string;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partId) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("trades").insert({
      part_id: partId,
      sender_id: user.id,
      message,
      status: "pending",
    });

    setLoading(false);

    if (!error) {
      router.push("/Trade");
    } else {
      alert(error.message);
    }
  };

  return (
    <RequireAuth>
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Make a Trade Offer</h1>

        <form onSubmit={submitTrade} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your trade offer…"
            className="w-full border rounded p-2 min-h-[120px]"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send Trade Offer"}
          </button>
        </form>
      </main>
    </RequireAuth>
  );
}
