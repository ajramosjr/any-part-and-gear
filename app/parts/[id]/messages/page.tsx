"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
};

export default function PartMessagesPage() {
  const params = useParams();
  const partId = params.id as string;

  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // 🔹 Load messages
  // 🔹 Mark messages as read when opening chat
useEffect(() => {
  if (!userId) return;

  supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("part_id", partId)
    .eq("receiver_id", userId)
    .is("read_at", null);
}, [userId, partId]);

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, content, sender_id, created_at")
        .eq("part_id", partId)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: true });

      if (!error) {
        setMessages(data ?? []);
      }

      setLoading(false);
    };

    loadMessages();
  }, [userId, partId]);

  // 🔹 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!text.trim() || !userId) return;

    const last = messages[messages.length - 1];
    const receiverId =
      last?.sender_id === userId ? undefined : last?.sender_id;

    if (!receiverId) return;

    const { error } = await supabase.from("messages").insert({
      content: text,
      sender_id: userId,
      receiver_id: receiverId,
      part_id: partId,
    });

    if (!error) {
      setText("");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: text,
          sender_id: userId,
          created_at: new Date().toISOString(),
        },
      ]);
    }
  };

  return (
    <RequireAuth>
      <main
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          height: "80vh",
        }}
      >
        <Link href="/inbox" style={{ marginBottom: 12 }}>
          ← Back to Inbox
        </Link>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#f9fafb",
            padding: 16,
            borderRadius: 12,
          }}
        >
          {loading && <p>Loading messages…</p>}

          {!loading && messages.length === 0 && (
            <p>No messages yet.</p>
          )}

          {messages.map((msg) => {
            const isMine = msg.sender_id === userId;

            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: isMine ? "flex-end" : "flex-start",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "10px 14px",
                    borderRadius: 14,
                    background: isMine ? "#0f172a" : "#e5e7eb",
                    color: isMine ? "#fff" : "#000",
                    fontSize: 14,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div
          style={{
            display: "flex",
            marginTop: 12,
            gap: 8,
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 999,
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "0 20px",
              borderRadius: 999,
              border: "none",
              background: "#0f172a",
              color: "#fff",
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
