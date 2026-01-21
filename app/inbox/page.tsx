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
  parts: { title: string } | null;
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          created_at,
          part_id,
          sender_id,
          parts:parts ( title )
        `)
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setMessages(data as Message[]);
      }

      setLoading(false);
    };

    fetchMessages();
  }, []);

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 800 }}>
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
              padding: 18,
              borderRadius: 14,
              marginBottom: 18,
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ fontWeight: 700 }}>
              Part: {msg.parts?.title || "Unknown"}
            </p>

            <p style={{ marginTop: 6 }}>{msg.content}</p>

            <p style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
              {new Date(msg.created_at).toLocaleString()}
            </p>

            <div style={{ marginTop: 12 }}>
              <Link
                href={`/messages/reply?partId=${msg.part_id}&to=${msg.sender_id}`}
                style={{
                  color: "#0f172a",
                  fontWeight: 600,
                }}
              >
                Reply
              </Link>
            </div>
          </div>
        ))}
      </main>
    </RequireAuth>
  );
}
