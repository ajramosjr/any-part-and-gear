"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ConversationPage() {
  const params = useParams();
  const partId = params.partId as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");

  // Fetch messages
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("part_id", partId)
        .order("created_at", { ascending: true });

      if (!error) {
        setMessages(data || []);
      }

      setLoading(false);
    };

    loadMessages();
  }, [partId]);

  // ✅ MARK AS READ WHEN OPENED
  useEffect(() => {
    fetch("/messages/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ part_id: partId }),
    });
  }, [partId]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    await fetch("/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        part_id: partId,
        content: messageText,
      }),
    });

    setMessageText("");
    location.reload();
  };

  if (loading) {
    return <p style={{ padding: 40 }}>Loading messages…</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Conversation</h2>

      <div style={{ marginBottom: 20 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 8,
              background: msg.read ? "#f3f4f6" : "#e0f2fe",
            }}
          >
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message…"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
