"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Conversation = {
  user_id: string;
  last_message: string;
  created_at: string;
  unread_count: number;
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
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

      if (error || !data) {
        console.error(error);
        setLoading(false);
        return;
      }

      const map = new Map<string, Conversation>();

      data.forEach((msg) => {
        const otherUser =
          msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;

        const isUnread =
          msg.receiver_id === user.id && msg.read_at === null;

        if (!map.has(otherUser)) {
          map.set(otherUser, {
            user_id: otherUser,
            last_message: msg.content,
            created_at: msg.created_at,
            unread_count: isUnread ? 1 : 0,
          });
        } else {
          if (isUnread) {
            map.get(otherUser)!.unread_count += 1;
          }
        }
      });

      setConversations(Array.from(map.values()));
      setLoading(false);
    }

    loadConversations();
  }, []);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading messages…</p>;
  }

  if (conversations.length === 0) {
    return <p style={{ padding: 40 }}>No messages yet</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 20 }}>Inbox</h1>

      {conversations.map((c) => (
        <Link
          key={c.user_id}
          href={`/messages/${c.user_id}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #333",
            textDecoration: "none",
            color: "white",
          }}
        >
          <div>
            <p style={{ margin: 0 }}>
              <strong>User:</strong> {c.user_id}
            </p>
            <p style={{ margin: 0, opacity: 0.7 }}>{c.last_message}</p>
          </div>

          {c.unread_count > 0 && (
            <span
              style={{
                background: "red",
                color: "white",
                borderRadius: "50%",
                minWidth: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              {c.unread_count}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
