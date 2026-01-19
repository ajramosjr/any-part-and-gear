"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  part_id: string;
  content: string;
  created_at: string;
  read: boolean;
};

export default function PartMessagesPage() {
  const params = useParams();
  const partId = params.id as string;

  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // 🔹 Load messages + mark unread as read
  useEffect(() => {
    if (!userId || !partId) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("part_id", partId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setMessages(data ?? []);
      setLoading(false);

      // Mark unread as read
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("part_id", partId)
        .eq("receiver_id", userId)
        .eq("read", false);
    };

    loadMessages();
  }, [userId, partId]);

  // 🔹 REAL-TIME SUBSCRIPTION
  useEffect(() => {
    if (!userId || !partId) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `part_id=eq.${partId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;

          setMessages((prev) => {
            // prevent duplicates
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });

          // auto-mark read if received
          if (newMessage.receiver_id === userId) {
            supabase
              .from("messages")
              .update({ read: true })
              .eq("id", newMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, partId]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!text.trim() || !userId) return;

    const otherUserId =
      messages.find((m) => m.sender_id !== userId)?.sender_id ||
      messages.find((m) => m.receiver_id !== userId)?.receiver_id;

    if (!otherUserId) return;

    await supabase.from("messages").insert({
      sender_id: userId,
      receiver_id: otherUserId,
      part_id: partId,
      content: text,
      read: false,
    });

    setText("");
  };

  if (loading) return <p style={{ padding: 40 }}>Loading messages…</p>;
  if (!userId) return <p style={{ padding: 40 }}>Please sign in</p>;

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>Messages</h1>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          maxHeight: 420,
          overflowY: "auto",
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              marginBottom: 12,
              textAlign: m.sender_id === userId ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 8,
                background:
                  m.sender_id === userId ? "#2563eb" : "#e5e7eb",
                color: m.sender_id === userId ? "#fff" : "#000",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
  );
}
