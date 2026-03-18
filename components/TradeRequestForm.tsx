"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface TradeRequestFormProps {
  partId: string | number;
  receiverId: string;
}

export default function TradeRequestForm({
  partId,
  receiverId,
}: TradeRequestFormProps) {
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

    const { error } = await supabase.from("trade_requests").insert({
      part_id: partId,
      sender_id: user.id,
      receiver_id: receiverId,
      message,
      status: "pending",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return <p className="text-green-600 mt-4">Trade request sent ✅</p>;
  }

  return (
    <div className="mt-6">
      <textarea
        className="w-full border rounded p-2"
        placeholder="What do you want to trade?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={submitRequest}
        className="mt-3 px-4 py-2 bg-black text-white rounded"
      >
        Send Trade Request
      </button>
    </div>
  );
}
