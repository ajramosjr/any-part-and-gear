"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/800x500?text=No+Image+Available";

export default function PartDetailPage() {
  const params = useParams();
  const partId = params.id as string;

  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  // 🔐 Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  // 📦 Fetch part
  useEffect(() => {
    if (!partId) return;

    const fetchPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", partId)
        .single();

      if (error) {
        console.error(error);
      }

      setPart(data);
      setLoading(false);
    };

    fetchPart();
  }, [partId]);

  // 📨 Send message
  const sendMessage = async () => {
    if (!messageText.trim()) return;

    setSending(true);

    const res = await fetch("/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiver_id: part.user_id,
        part_id: part.id,
        content: messageText,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error || "Failed to send message");
    } else {
      setMessageText("");
      alert("Message sent!");
    }

    setSending(false);
  };

  if (loading) {
    return <p style={{ padding: 40 }}>Loading…</p>;
  }

  if (!part) {
    return <p style={{ padding: 40 }}>Part not found</p>;
  }

  const isOwner = currentUserId === part.user_id;
  const image = part.image || PLACEHOLDER_IMAGE;

  return (
    <div style={{ padding: 40 }}>
      <Link href="/browse" style={{ color: "#2563eb" }}>
        ← Back to Browse
      </Link>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          marginTop: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <img
          src={image}
          alt={part.title}
          style={{
            width: "100%",
            height: 360,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 16,
          }}
        />

        <h1>{part.title}</h1>
        <p>{part.description}</p>

        {part.created_at && (
          <p style={{ color: "#666", marginTop: 12 }}>
            Listed on {new Date(part.created_at).toLocaleDateString()}
          </p>
        )}

        {/* 📨 MESSAGE SELLER */}
        {!isOwner && currentUserId && (
          <div style={{ marginTop: 30 }}>
            <h3>Message Seller</h3>

            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Ask about this part..."
              rows={4}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                marginTop: 8,
              }}
            />

            <button
              onClick={sendMessage}
              disabled={sending}
              style={{
                marginTop: 10,
                padding: "10px 18px",
                borderRadius: 8,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                cursor: "pointer",
                opacity: sending ? 0.6 : 1,
              }}
            >
              {sending ? "Sending…" : "Send Message"}
            </button>
          </div>
        )}

        {!currentUserId && (
          <p style={{ marginTop: 20, color: "#888" }}>
            Log in to message the seller.
          </p>
        )}
      </div>
    </div>
  );
}
