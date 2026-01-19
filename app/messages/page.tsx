"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Conversation = {
  part_id: string;
  part_title: string;
  other_user_id: string;
  last_message: string;
  last_message_at: string;
};

export default function MessagesInboxPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Get current user
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
       * We fetch messages involving this user,
       * newest first, then group them by part_id
       */
      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          created_at,
          part_id,
          sender_id,
          receiver_id,
          parts (
            title
          )
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const map = new Map<string, Conversation>();

      data?.forEach((msg: any) => {
        if (map.has(msg.part_id)) return;

        const otherUser =
          msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

        map.set(msg.part_id, {
          part_id: msg.part_id,
          part_title: msg.parts?.title ?? "Unknown Part",
          other_user_id: otherUser,
          last_message: msg.content,
          last_message_at: msg.created_at,
        });
      });

      setConversations(Array.from(map.values()));
      setLoading(false);
    };

    loadInbox();
  }, [userId]);

  if (loading) return <p style={{ padding: 40 }}>Loading inbox…</p>;
  if (!userId) return <p style={{ padding: 40 }}>Please sign in</p>;

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>Messages</h1>

      {conversations.length === 0 && (
        <p style={{ marginTop: 20 }}>No conversations yet.</p>
      )}

      <div style={{ marginTop: 20 }}>
        {conversations.map((c) => (
          <Link
            key={c.part_id}
            href={`/parts/${c.part_id}/messages`}
            style={{
              display: "block",
              padding: 16,
              marginBottom: 12,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              textDecoration: "none",
              color: "#000",
            }}
          >
            <strong>{c.part_title}</strong>

            <p style={{ marginTop: 6, color: "#555" }}>
              {c.last_message}
            </p>

            <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
              {new Date(c.last_message_at).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
