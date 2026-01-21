"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  read: boolean;
};

export default function PartMessagesPage() {
  const params = useParams();
  const partId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // 🔹 Load messages + mark as read
  useEffect(() => {
    if (!userId || !partId) return;

    const loadMessages = async () => {
      // 1️⃣ Fetch messages
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("part_id", partId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }

      // 2️⃣ MARK AS READ (THIS IS THE IMPORTANT PART)
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("part_id", partId)
        .eq("receiver_id", userId)
        .eq("read", false);

      setLoading(false);
    };

    loadMessages();
  }, [userId, partId]);

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 700 }}>
        <h1>Messages</h1>

        {loading && <p>Loading conversation…</p>}

        {!loading && messages.length === 0 && (
          <p>No messages yet.</p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              background: msg.sender_id === userId ? "#eff6ff" : "#fff",
              padding: 14,
              borderRadius: 12,
              marginBottom: 12,
              alignSelf:
                msg.sender_id === userId ? "flex-end" : "flex-start",
            }}
          >
            <p>{msg.content}</p>

            <p style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
              {new Date(msg.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </main>
    </RequireAuth>
  );
}
