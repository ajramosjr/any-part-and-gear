"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Conversation = {
  part_id: string;
  part_title: string;
  other_user_id: string;
  other_user_email: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
};

export default function MessagesInboxPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // 🔹 Load inbox
  useEffect(() => {
    if (!userId) return;

    const loadInbox = async () => {
      /**
       * This query assumes:
       * - messages table
       * - parts table (id, title)
       * - sender_id / receiver_id
       */
      const { data, error } = await supabase.rpc("get_message_inbox", {
        current_user_id: userId,
      });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setConversations(data ?? []);
      setLoading(false);
    };

    loadInbox();
  }, [userId]);

  if (loading) return <p style={{ padding: 40 }}>Loading inbox…</p>;
  if (!userId) return <p style={{ padding: 40 }}>Please sign in</p>;

  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1>Inbox</h1>

      {conversations.length === 0 && (
        <p style={{ marginTop: 20 }}>No messages yet</p>
      )}

      <div style={{ marginTop: 20 }}>
        {conversations.map((c) => (
          <Link
            key={`${c.part_id}-${c.other_user_id}`}
            href={`/parts/${c.part_id}/messages`}
            style={{
              display: "block",
              padding: 16,
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              marginBottom: 12,
              textDecoration: "none",
              color: "inherit",
              background: c.unread_count > 0 ? "#eff6ff" : "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <strong>{c.part_title}</strong>
              <span style={{ fontSize: 12, color: "#666" }}>
                {new Date(c.last_message_time).toLocaleString()}
              </span>
            </div>

            <div style={{ color: "#374151" }}>{c.last_message}</div>

            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              With: {c.other_user_email}
            </div>

            {c.unread_count > 0 && (
              <div
                style={{
                  marginTop: 6,
                  display: "inline-block",
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 999,
                  padding: "2px 8px",
                  fontSize: 12,
                }}
              >
                {c.unread_count} new
              </div>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
