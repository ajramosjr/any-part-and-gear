"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/800x500?text=No+Image+Available";

export default function PartDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  // Fetch part
  useEffect(() => {
    if (!id) return;

    const fetchPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);

      setPart(data);
      setLoading(false);
    };

    fetchPart();
  }, [id]);

  // Fetch current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });
  }, []);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setSending(true);

    await fetch("/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiver_id: part.user_id,
        part_id: part.id,
        content: messageText,
      }),
    });

    setMessageText("");
    setSending(false);
    alert("Message sent!");
  };

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
  if (!part) return <p style={{ padding: 40 }}>Part not found</p>;

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

        {!isOwner && currentUserId && (
          <div style={{ marginTop: 24 }}>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Message the seller…"
              style={{
                width: "100%",
                minHeight: 80,
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={handleSendMessage}
              disabled={sending}
              style={{
                marginTop: 10,
                padding: "10px 16px",
                background: "#2563eb",
                color: "#fff",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
