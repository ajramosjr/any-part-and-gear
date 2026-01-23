"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";

export default function TradeRequestForm({
  partId,
  receiverId,
}: {
  partId: string;
  receiverId: string;
}) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submitRequest = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to send a trade request");
      return;
    }

    await supabase.from("trade_requests").insert({
      part_id: partId,
      sender_id: user.id,
      receiver_id: receiverId,
      message,
    });

    setSent(true);
  };

  if (sent) {
    return <p style={{ color: "green" }}>Trade request sent ✅</p>;
  }

  return (
    <div style={{ marginTop: 16 }}>
      <textarea
        placeholder="What do you want to trade?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <button
        onClick={submitRequest}
        style={{ marginTop: 8, padding: "8px 12px" }}
      >
        Send Trade Request
      </button>
    </div>
  );
}
