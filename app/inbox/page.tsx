"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/components/RequireAuth";

type Message = {
  id: string;
  content: string;
  created_at: string;
  part_id: string;
  sender_id: string | null;
  parts: { title: string }[] | null;
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

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
        .eq("receiver_id", auth.user.id)
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
      <main style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
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
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <p style={{ fontWeight: 600 }}>
              Part: {msg.parts?.[0]?.title || "Unknown"}
            </p>

            <p style={{ marginTop: 6 }}>{msg.content}</p>

            <p style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
              {new Date(msg.created_at).toLocaleString()}
            </p>

            <div style={{ marginTop: 10, display: "flex", gap: 16 }}>
              <Link
                href={`/parts/${msg.part_id}`}
                style={{ color: "#2563eb", fontWeight: 600 }}
              >
                View Part
              </Link>

              {msg.sender_id && (
                <Link
                  href={`/seller/${msg.sender_id}`}
                  style={{ color: "#16a34a", fontWeight: 600 }}
                >
                  Leave Review →
                </Link>
              )}
            </div>
          </div>
        ))}
      </main>
    </RequireAuth>
  );
}
