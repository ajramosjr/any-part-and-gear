"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

export default function PartMessagesPage() {
  const params = useParams();
  const partId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Load user + initial messages
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("part_id", partId)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      setMessages(data ?? []);
      setLoading(false);

      // ✅ Mark messages as read
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("part_id", partId)
        .eq("receiver_id", user.id);
    };

    init();
  }, [partId]);

  // 🔥 REALTIME SUBSCRIPTION
  useEffect(() => {
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
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partId]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!text.trim() || !userId) return;

    const { data: part } = await supabase
      .from("parts")
      .select("user_id")
      .eq("id", partId)
      .single();

    if (!part) return;

    await supabase.from("messages").insert({
      sender_id: userId,
      receiver_id: part.user_id,
      part_id: partId,
      content: text,
    });

    setText("");
  };

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 800 }}>
        <h1>Messages</h1>

        {loading && <p>Loading conversation…</p>}

        <div
          style={{
            marginTop: 20,
            background: "#fff",
            padding: 20,
            borderRadius: 12,
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                marginBottom: 10,
                padding: 12,
                borderRadius: 10,
                maxWidth: "70%",
                background:
                  msg.sender_id === userId ? "#dbeafe" : "#f1f5f9",
                marginLeft:
                  msg.sender_id === userId ? "auto" : "0",
              }}
            >
              <p style={{ margin: 0 }}>{msg.content}</p>
              <div style={{ fontSize: 11, color: "#64748b" }}>
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 8,
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #cbd5f5",
            }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </main>
    </RequireAuth>
  );
}
