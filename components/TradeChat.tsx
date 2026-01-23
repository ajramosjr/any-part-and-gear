"use client";

import { useTradeChat } from "@/hooks/useTradeChat";
import { sendTradeMessage } from "@/lib/sendTradeMessage";
import { useState } from "react";

export default function TradeChat({
  tradeRequestId,
  userId,
}: {
  tradeRequestId: string;
  userId: string;
}) {
  const { messages, loading } = useTradeChat(tradeRequestId);
  const [text, setText] = useState("");

  if (loading) return <p>Loading chat...</p>;

  const send = async () => {
    if (!text.trim()) return;
    await sendTradeMessage(tradeRequestId, userId, text);
    setText("");
  };

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 8 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 6 }}>
            <strong>{m.sender_id === userId ? "You" : "Them"}:</strong>{" "}
            {m.message}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message…"
          style={{ flex: 1 }}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
