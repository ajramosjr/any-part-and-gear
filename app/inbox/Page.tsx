"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInbox = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          message,
          created_at,
          sender_id,
          part_id,
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

    loadInbox();
  }, []);

  if (loading) return <p style={{ padding: 40 }}>Loading inbox…</p>;

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 800 }}>
        <h1>Your Inbox</h1>

        {messages.length === 0 && (
          <p style={{ marginTop: 20 }}>No messages yet.</p>
        )}

        {messages.map((msg) => (
          <Link
            key={msg.id}
            href={`/messages/${msg.id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 12,
                marginTop: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <strong>{msg.parts?.title || "Part"}</strong>

              <p style={{ marginTop: 6, color: "#333" }}>
                {msg.message.length > 80
                  ? msg.message.slice(0, 80) + "…"
                  : msg.message}
              </p>

              <p style={{ fontSize: 12, color: "#777", marginTop: 8 }}>
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </main>
    </RequireAuth>
  );
}
