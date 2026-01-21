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
};

export default function PartMessagesPage() {
  const { id: partId } = useParams<{ id: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
const [sellerRating, setSellerRating] = useState<number | null>(null);

useEffect(() => {
  const loadRating = async () => {
    const rating = await getSellerRating(part.user_id);
    setSellerRating(rating);
  };

  if (part?.user_id) {
    loadRating();
  }
}, [part?.user_id]);
  // 🔐 Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // 💬 Load conversation
  useEffect(() => {
    if (!userId || !partId) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("part_id", partId)
        .or(
          `sender_id.eq.${userId},receiver_id.eq.${userId}`
        )
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);

        // Identify the other user
        const first = data.find(
          (m) => m.sender_id !== userId
        );
        if (first) {
          setOtherUserId(first.sender_id);
        }
      }

      setLoading(false);
    };

    loadMessages();
  }, [userId, partId]);

  // ✉️ Send message
  const sendMessage = async () => {
    if (!newMessage || !userId || !otherUserId) return;

    const { error } = await supabase.from("messages").insert({
      part_id: partId,
      sender_id: userId,
      receiver_id: otherUserId,
      content: newMessage,
    });
<p style={{ marginTop: 6 }}>
  Seller:{" "}
  <Link
    href={`/seller/${part.user_id}`}
    style={{ color: "#2563eb", fontWeight: 600 }}
  >
    View profile
  </Link>

  {sellerRating && (
    <span style={{ marginLeft: 8, color: "#f59e0b", fontWeight: 600 }}>
      ⭐ {sellerRating}
    </span>
  )}
</p>
    if (!error) {
      setMessages([
        ...messages,
        {
          id: crypto.randomUUID(),
          content: newMessage,
          created_at: new Date().toISOString(),
          sender_id: userId,
          receiver_id: otherUserId,
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 800 }}>
        <h1>Conversation</h1>

        {loading && <p>Loading messages…</p>}

        <div style={{ marginTop: 20 }}>
          {messages.map((msg) => {
            const isMe = msg.sender_id === userId;

            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    background: isMe ? "#0f172a" : "#e5e7eb",
                    color: isMe ? "#facc15" : "#111",
                    padding: "10px 14px",
                    borderRadius: 14,
                    maxWidth: "70%",
                  }}
                >
                  {msg.content}
                  <div
                    style={{
                      fontSize: 10,
                      marginTop: 4,
                      opacity: 0.7,
                    }}
                  >
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✍️ Send box */}
        <div style={{ marginTop: 24 }}>
          <textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{
              width: "100%",
              height: 90,
              padding: 12,
              borderRadius: 12,
            }}
          />

          <button
            onClick={sendMessage}
            disabled={!newMessage}
            style={{
              marginTop: 10,
              padding: "10px 18px",
              borderRadius: 12,
              background: "#0f172a",
              color: "#facc15",
              fontWeight: 700,
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
