"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

type Message = {
  id: string;
  content: string;
  created_at: string;
  part_id: string | null;
  sender_id: string;
  parts?: {
    title: string;
  } | null;
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
        .select(`
          id,
          content,
          created_at,
          part_id,
          sender_id,
          parts (
            title
          )
        `)
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
      <main
        style={{
          padding: "40px 20px",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <h1 style={{ color: "#0b1f3a", marginBottom: 24 }}>Inbox</h1>

        {loading && <p>Loading messages…</p>}

        {!loading && messages.length === 0 && (
          <p style={{ color: "#555" }}>No messages yet.</p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              background: "#ffffff",
              padding: 18,
              borderRadius: 12,
              marginBottom: 16,
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              borderLeft: "4px solid #c9a24d", // gold accent
            }}
          >
            <p style={{ fontWeight: 600, color: "#0b1f3a" }}>
              Part: {msg.parts?.title || "Unknown Part"}
            </p>

            <p style={{ margin: "8px 0", color: "#333" }}>
              {msg.content}
            </p>

            <p style={{ fontSize: 12, color: "#777" }}>
              {new Date(msg.created_at).toLocaleString()}
            </p>

            {msg.part_id && (
              <Link
                href={`/parts/${msg.part_id}`}
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  color: "#0b1f3a",
                  fontSize: 14,
                  textDecoration: "underline",
                }}
              >
                View Part
              </Link>
            )}
          </div>
        ))}
      </main>
    </RequireAuth>
  );
}
