"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  part_id: string;
  content: string;
  created_at: string;
};

export default function PartMessagesPage() {
  const params = useParams();
  const partId = params.id as string;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [part, setPart] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  // 🔹 Load part + messages
  useEffect(() => {
    if (!partId || !currentUserId) return;

    const loadData = async () => {
      const { data: partData } = await supabase
        .from("parts")
        .select("*")
        .eq("id", partId)
        .single();

      setPart(partData);

      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
        .eq("part_id", partId)
        .order("created_at", { ascending: true });

      setMessages(messagesData ?? []);
      setLoading(false);
    };

    loadData();
  }, [partId, currentUserId]);

  // 🔴 Realtime messages for this part
  useEffect(() => {
    if (!partId) return;

    const channel = supabase
      .channel(`part-chat-${partId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as Message;
          if (msg.part_id !== partId) return;
          setMessages((prev) => [...prev, msg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partId]);

  const sendMessage = async () => {
    if (!messageText.trim() || !currentUserId || !part) return;

    const receiverId =
      currentUserId === part.user_id ? null : part.user_id;

    if (!receiverId) return;

    await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: receiverId,
      part_id: partId,
      content: messageText,
    });

    setMessageText("");
  };

  if (loading) return <p style={{ padding: 40 }}>Loading chat…</p>;
  if (!currentUserId) return <p style={{ padding: 40 }}>Please sign in</p>;
  if (!part) return <p style={{ padding: 40 }}>Part not found</p>;

  return (
    <main style={{ padding: 40, maxWidth: 700 }}>
      <Link href={`/parts/${partId}`}>← Back to part</Link>

      <h1 style={{ marginTop: 16 }}>Messages about:</h1>
      <h2 style={{ color: "#2563eb" }}>{part.title}</h2>

      <div
        style={{
          marginTop: 20,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 16,
          minHeight: 300,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 12,
              textAlign:
                msg.sender_id === currentUserId ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 12,
                background:
                  msg.sender_id === currentUserId
                    ? "#2563eb"
                    : "#e5e7eb",
                color:
                  msg.sender_id === currentUserId ? "#fff" : "#000",
                maxWidth: "70%",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <textarea
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="Ask about this part…"
        style={{
          marginTop: 16,
          width: "100%",
          padding: 10,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          marginTop: 10,
          padding: "10px 16px",
          background: "#2563eb",
          color: "#fff",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
        }}
      >
        Send Message
      </button>
    </main>
  );
}
