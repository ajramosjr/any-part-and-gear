"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/800x500?text=No+Image+Available";

export default function PartDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // messaging state
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setPart(data);
      }

      setLoading(false);
    };

    fetchPart();
  }, [id]);

  const sendMessage = async () => {
    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in to message the seller.");
      setSending(false);
      return;
    }

    const { error } = await supabase.from("messages").insert({
      content: messageText,
      sender_id: user.id,
      receiver_id: part.user_id,
      part_id: part.id,
    });

    setSending(false);

    if (error) {
      alert("Failed to send message");
    } else {
      setShowMessage(false);
      setMessageText("");
      router.push("/inbox");
    }
  };

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
  if (!part) return <p style={{ padding: 40 }}>Part not found</p>;

  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
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
          src={part.image || PLACEHOLDER_IMAGE}
          alt={part.title}
          style={{
            width: "100%",
            height: 360,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 16,
          }}
        />

        <h1 style={{ fontSize: 28 }}>{part.title}</h1>
        <p style={{ marginTop: 12 }}>{part.description}</p>

        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => setShowMessage(true)}
            style={{
              padding: "14px 24px",
              fontSize: 16,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: "#0f172a",
              color: "#fff",
            }}
          >
            Message Seller
          </button>
        </div>

        {part.created_at && (
          <p style={{ color: "#666", marginTop: 16, fontSize: 14 }}>
            Listed on {new Date(part.created_at).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* MESSAGE MODAL */}
      {showMessage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 16,
              width: "90%",
              maxWidth: 400,
            }}
          >
            <h3 style={{ marginBottom: 12 }}>Message Seller</h3>

            <textarea
              placeholder="Ask about condition, fitment, trades..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{
                width: "100%",
                height: 120,
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                marginBottom: 16,
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowMessage(false)}
                style={{ marginRight: 12 }}
              >
                Cancel
              </button>

              <button
                onClick={sendMessage}
                disabled={!messageText || sending}
                style={{
                  background: "#0f172a",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
