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

  // 🔹 Load user + messages
  useEffect(() => {
    const loadConversation = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      // 🔹 Fetch messages for this part
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("part_id", partId)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      setMessages(data ?? []);
      setLoading(false);

      // ✅ MARK AS READ (THIS IS YOUR SNIPPET)
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("part_id", partId)
        .eq("receiver_id", user.id);
    };

    loadConversation();
  }, [partId]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!text.trim() || !userId) return;

    // Get part owner
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

    // Reload messages
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("part_id", partId)
      .order("created_at", { ascending: true });

    setMessages(data ?? []);
  };

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 800 }}>
        <h1>Messages</h1>

        {loading && <p>Loading conversation…</p>}

        {!loading && (
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
                  marginBottom: 12,
                  padding: 12,
                  borderRadius: 10,
                  background:
                    msg.sender_id === userId ? "#dbeafe" : "#f1f5f9",
                  alignSelf:
                    msg.sender_id === userId ? "flex-end" : "flex-start",
                }}
              >
                <p style={{ margin: 0 }}>{msg.content}</p>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Send box */}
        <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
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
