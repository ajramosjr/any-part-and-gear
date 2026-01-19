"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Conversation = {
  user_id: string;
  last_message: string;
  created_at: string;
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!data) return;

      const map = new Map<string, Conversation>();

      data.forEach((msg) => {
        const otherUser =
          msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;

        if (!map.has(otherUser)) {
          map.set(otherUser, {
            user_id: otherUser,
            last_message: msg.content,
            created_at: msg.created_at,
          });
        }
      });

      setConversations(Array.from(map.values()));
      setLoading(false);
    }

    loadConversations();
  }, []);

  if (loading) return <p style={{ padding: 40 }}>Loading inbox…</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Messages</h1>

      {conversations.length === 0 && <p>No messages yet</p>}

      {conversations.map((c) => (
        <Link
          key={c.user_id}
          href={`/messages/${c.user_id}`}
          style={{
            display: "block",
            padding: 12,
            borderBottom: "1px solid #333",
            textDecoration: "none",
            color: "white",
          }}
        >
          <p><strong>User:</strong> {c.user_id}</p>
          <p>{c.last_message}</p>
        </Link>
      ))}
    </div>
  );
}
