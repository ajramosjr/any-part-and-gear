"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

export default function ConversationPage() {
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [userIdSelf, setUserIdSelf] = useState<string | null>(null);

  useEffect(() => {
    async function loadMessages() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserIdSelf(user.id);

      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`
        )
        .order("created_at");

      setMessages(data || []);
    }

    loadMessages();
  }, [userId]);

  async function sendMessage() {
    if (!content.trim() || !userIdSelf) return;

    await fetch("/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiver_id: userId,
        content,
      }),
    });

    setContent("");
    location.reload();
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Conversation</h2>

      <div style={{ marginBottom: 20 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.sender_id === userIdSelf ? "right" : "left",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: 10,
                borderRadius: 8,
                background:
                  msg.sender_id === userIdSelf ? "#2563eb" : "#333",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message"
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
