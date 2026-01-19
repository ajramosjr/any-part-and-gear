"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  part_id: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!error && data) setMessages(data);
      setLoading(false);
    };

    loadMessages();
  }, []);

  if (loading) return <p style={{ padding: 40 }}>Loading messages…</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Messages</h1>

      {messages.length === 0 && <p>No messages yet.</p>}

      {messages.map((msg) => (
        <Link
          key={msg.id}
          href={`/messages/${msg.part_id}`}
          style={{
            display: "block",
            padding: 16,
            borderRadius: 10,
            border: "1px solid #ddd",
            marginBottom: 12,
            background: "#fff",
            textDecoration: "none",
            color: "#000",
          }}
        >
          <p style={{ fontWeight: 600 }}>{msg.content}</p>
          <small>{new Date(msg.created_at).toLocaleString()}</small>
        </Link>
      ))}
    </div>
  );
}
