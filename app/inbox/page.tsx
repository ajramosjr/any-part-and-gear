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
  sender_id: string;
  parts: {
    title: string;
  } | null;
};

type ReviewRequest = {
  id: string;
  part_id: string;
  seller_id: string;
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInbox = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 📩 Messages
      const { data: messageData } = await supabase
        .from("messages")
        .select(
          `
          id,
          content,
          created_at,
          part_id,
          sender_id,
          parts ( title )
        `
        )
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      setMessages((messageData || []) as unknown as Message[]);

      // ⭐ Review requests
      const { data: requestData } = await supabase
        .from("review_requests")
        .select("id, part_id, seller_id")
        .eq("buyer_id", user.id)
        .eq("completed", false);

      setReviewRequests(requestData || []);

      setLoading(false);
    };

    loadInbox();
  }, []);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading inbox…</p>;
  }

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 900 }}>
        <h1 style={{ marginBottom: 24 }}>Inbox</h1>

        {/* ⭐ Review Requests */}
        {reviewRequests.length > 0 && (
          <>
            <h3 style={{ marginBottom: 12 }}>Pending Reviews</h3>

            {reviewRequests.map((r) => (
              <div
                key={r.id}
                style={{
                  background: "#fef3c7",
                  padding: 16,
                  borderRadius: 10,
                  marginBottom: 12,
                  border: "1px solid #fde68a",
                }}
              >
                <p style={{ fontWeight: 600 }}>
                  ⭐ Please review your recent purchase
                </p>
                <Link
                  href={`/reviews/submit?partId=${r.part_id}&sellerId=${r.seller_id}`}
                  style={{ color: "#2563eb", fontWeight: 600 }}
                >
                  Leave Review →
                </Link>
              </div>
            ))}
          </>
        )}

        {/* 📩 Messages */}
        <h3 style={{ marginTop: 32, marginBottom: 12 }}>Messages</h3>

        {messages.length === 0 && <p>No messages yet.</p>}

        {messages.map((m) => (
          <Link
            key={m.id}
            href={`/messages/${m.part_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 10,
                marginBottom: 12,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <strong>{m.parts?.title || "Part inquiry"}</strong>
              <p style={{ marginTop: 6 }}>{m.content}</p>
              <p style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                {new Date(m.created_at).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </main>
    </RequireAuth>
  );
}
