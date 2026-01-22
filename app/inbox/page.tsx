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
  type: string;
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("messages")
        .select("id, content, created_at, part_id, type")
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      setMessages(data || []);
      setLoading(false);
    };

    loadMessages();
  }, []);

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 700 }}>
        <h1>Inbox</h1>

        {loading && <p>Loading…</p>}

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
            <p>{msg.content}</p>

            {msg.type === "review_request" && (
              <Link
                href={`/review/${msg.part_id}`}
                style={{
                  color: "#2563eb",
                  fontWeight: 600,
                  marginTop: 6,
                  display: "inline-block",
                }}
              >
                Leave Review →
              </Link>
            )}

            <p style={{ fontSize: 12, color: "#666" }}>
              {new Date(msg.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </main>
    </RequireAuth>
  );
}
