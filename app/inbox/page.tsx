"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

type Message = {
  id: string;
  content: string;
  created_at: string;
  part_id: string;
  sender_id: string;
  parts: {
    title: string;
  }[]; // ✅ ARRAY (this fixes the error)
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          id,
          content,
          created_at,
          part_id,
          sender_id,
          parts ( title )
        `
        )
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setMessages(data);
      }

      setLoading(false);
    };

    fetchMessages();
  }, []);

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 700 }}>
        <h1>Inbox</h1>

        {loading && <p>Loading messages…</p>}

        {!loading && messages.length === 0 && (
          <p>No messages yet.</p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ fontWeight: 600 }}>
              Part: {msg.parts?.[0]?.title || "Unknown Part"}
            </p>

            <p>{msg.content}</p>

            <p style={{ fontSize: 12, color: "#666" }}>
              {new Date(msg.created_at).toLocaleString()}
            </p>

            <Link
              href={`/parts/${msg.part_id}`}
              style={{ color: "#2563eb", fontSize: 14 }}
            >
              View Part
            </Link>
          </div>
        ))}
      </main>
    </RequireAuth>
  );
}
