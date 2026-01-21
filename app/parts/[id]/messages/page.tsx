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
  offer_price: number | null;
  offer_status: string | null;
  created_at: string;
};

export default function PartMessagesPage() {
  const params = useParams();
  const partId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [offer, setOffer] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<string | null>(null);

  // 🔹 Load user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // 🔹 Load part seller
  useEffect(() => {
    supabase
      .from("parts")
      .select("user_id")
      .eq("id", partId)
      .single()
      .then(({ data }) => {
        setSellerId(data?.user_id ?? null);
      });
  }, [partId]);

  // 🔹 Load messages
  const loadMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("part_id", partId)
      .order("created_at");

    setMessages(data ?? []);
  };

  useEffect(() => {
    loadMessages();
  }, [partId]);

  // 🔹 Send message / offer
  const sendMessage = async () => {
    if (!userId || !sellerId) return;

    const receiverId =
      userId === sellerId ? messages[0]?.sender_id : sellerId;

    await supabase.from("messages").insert({
      part_id: partId,
      sender_id: userId,
      receiver_id: receiverId,
      content: text || null,
      offer_price: offer ? Number(offer) : null,
      offer_status: offer ? "pending" : null,
    });

    setText("");
    setOffer("");
    loadMessages();
  };

  // 🔹 Accept / Reject offer
  const updateOffer = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    await supabase
      .from("messages")
      .update({ offer_status: status })
      .eq("id", id);

    loadMessages();
  };

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 700 }}>
        <h1>Messages</h1>

        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              background: "#fff",
              padding: 14,
              borderRadius: 12,
              marginBottom: 12,
              border:
                m.sender_id === userId
                  ? "2px solid #2563eb"
                  : "1px solid #e5e7eb",
            }}
          >
            {m.content && <p>{m.content}</p>}

            {m.offer_price && (
              <p style={{ fontWeight: 600 }}>
                💰 Offer: ${m.offer_price}
              </p>
            )}

            {m.offer_status && (
              <p>Status: {m.offer_status}</p>
            )}

            {/* Seller controls */}
            {userId === sellerId &&
              m.offer_status === "pending" && (
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() =>
                      updateOffer(m.id, "accepted")
                    }
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      updateOffer(m.id, "rejected")
                    }
                    style={{ marginLeft: 8 }}
                  >
                    Reject
                  </button>
                </div>
              )}
          </div>
        ))}

        <div style={{ marginTop: 20 }}>
          <textarea
            placeholder="Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <br />

          <input
            placeholder="Offer price (optional)"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
          />
          <br />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>
      </main>
    </RequireAuth>
  );
}
