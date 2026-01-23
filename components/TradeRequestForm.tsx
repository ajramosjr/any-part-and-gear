"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

interface TradeRequestFormProps {
  partId: number;
  receiverId: string;
}

export default function TradeRequestForm({
  partId,
  receiverId,
}: TradeRequestFormProps) {
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitTrade = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("trades").insert({
      part_id: partId,
      sender_id: user.id,
      receiver_id: receiverId,
      message,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Trade request sent");
      setMessage("");
    }
  };

  return (
    <div className="border rounded-lg p-4 mt-6">
      <h3 className="font-semibold mb-2">Request a Trade</h3>

      <textarea
        className="w-full border rounded p-2 mb-3"
        placeholder="Message to seller"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={submitTrade}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Trade Request"}
      </button>
    </div>
  );
}
