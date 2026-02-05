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
  const [sending, setSending] = useState(false);

  const sendTradeOffer = async () => {
    if (!message.trim()) return;

    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSending(false);
      return;
    }

    const { error } = await supabase.from("trade_messages").insert({
      part_id: partId,
      sender_id: user.id,
      message,
    });

    setSending(false);

    if (!error) {
      router.push("/messages");
    } else {
      alert(error.message);
    }
  };

  return (
    <RequireAuth>
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          Send Trade Offer
        </h1>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your trade offer…"
          className="w-full border rounded-lg p-3 mb-4 min-h-[120px]"
        />

        <button
          onClick={sendTradeOffer}
          disabled={sending}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send Offer"}
        </button>
      </main>
    </RequireAuth>
  );
}
