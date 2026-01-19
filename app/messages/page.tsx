"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Conversation = {
  other_user_id: string;
  unread_count: number;
};

export default function MessagesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadInbox = async () => {
      const { data } = await supabase
        .from("messages")
        .select("sender_id, receiver_id, is_read")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

      if (!data) {
        setLoading(false);
        return;
      }

      const map = new Map<string, number>();

      data.forEach((msg) => {
        const other =
          msg.sender_id === userId
            ? msg.receiver_id
            : msg.sender_id;

        if (!map.has(other)) map.set(other, 0);

        if (!msg.is_read && msg.receiver_id === userId) {
          map.set(other, map.get(other)! + 1);
        }
      });

      const result = Array.from(map.entries()).map(
        ([other_user_id, unread_count]) => ({
          other_user_id,
          unread_count,
        })
      );

      setConversations(result);
      setLoading(false);
    };

    loadInbox();
  }, [userId]);

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
  if (!userId) return <p style={{ padding: 40 }}>Please sign in</p>;

  return (
    <main style={{ padding: 40, maxWidth: 600 }}>
      <h1>Messages</h1>

      {conversations.length === 0 && <p>No conversations</p>}

      {conversations.map((c) => (
        <Link
          key={c.other_user_id}
          href={`/messages/${c.other_user_id}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid #e5e7eb",
            textDecoration: "none",
            color: "#000",
          }}
        >
          <span>User: {c.other_user_id.slice(0, 8)}…</span>

          {c.unread_count > 0 && (
            <span
              style={{
                background: "#dc2626",
                color: "#fff",
                padding: "2px 8px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {c.unread_count}
            </span>
          )}
        </Link>
      ))}
    </main>
  );
}
