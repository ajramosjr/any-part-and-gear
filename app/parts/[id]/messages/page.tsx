"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

type Message = {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
};

export default function PartMessagesPage() {
  const { id: partId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // 🔹 Load messages + mark as read
  useEffect(() => {
    if (!userId || !partId) return;

    const load = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("part_id", partId)
        .order("created_at", { ascending: true });

      setMessages(data || []);
      setLoading(false);

      // ✅ MARK AS READ
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("part_id", partId)
        .eq("receiver_id", userId);
    };

    load();

    // 🔹 Real-time updates
    const channel = supabase
      .channel("messages-" + partId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, partId]);

  const sendMessage = async () => {
    if (!text.trim() || !userId) return;

    await supabase.from("messages").insert({
      content: text,
      part_id: partId,
      sender_id: userId,
      receiver_id:
        messages.find((m) => m.sender_id !== userId)?.sender_id,
    });

    setText("");
  };

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 700 }}>
        <h1>Conversation</h1>

        {loading && <p>Loading messages…</p>}

        <div style={{ marginTop: 20 }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                background: m.sender_id === userId ? "#dbeafe" : "#fff",
                padding: 12,
                borderRadius: 10,
                marginBottom: 10,
                maxWidth: "75%",
                marginLeft: m.sender_id === userId ? "auto" : "0",
              }}
            >
              <p style={{ margin: 0 }}>{m.content}</p>
              <small style={{ color: "#666" }}>
                {new Date(m.created_at).toLocaleTimeString()}
              </small>
            </div>
          ))}
        </div>

        {/* 🔹 MESSAGE INPUT */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
            borderTop: "1px solid #e5e7eb",
            paddingTop: 12,
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message…"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              background: "#1e40af",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </main>
    </RequireAuth>
  );
}
