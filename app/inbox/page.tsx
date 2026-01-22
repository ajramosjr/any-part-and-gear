"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import VerifiedBadge from "@/components/VerifiedBadge";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInbox = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      /* ---------------------------
         Load messages
      ---------------------------- */
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      if (!msgs) return;

      setMessages(msgs);

      /* ---------------------------
         Load seller verification
      ---------------------------- */
      const senderIds = [...new Set(msgs.map((m) => m.sender_id))];

      const { data: sellers } = await supabase
        .from("sellers")
        .select("id, verified")
        .in("id", senderIds);

      const map: Record<string, boolean> = {};
      sellers?.forEach((s) => {
        map[s.id] = s.verified;
      });

      setVerifiedMap(map);
      setLoading(false);
    };

    loadInbox();
  }, []);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading inbox…</p>;
  }

  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1>Inbox</h1>

      {messages.length === 0 && (
        <p style={{ marginTop: 20 }}>No messages yet.</p>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 12,
            marginBottom: 14,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ fontWeight: 600 }}>
            Seller{" "}
            <VerifiedBadge
              verified={Boolean(verifiedMap[msg.sender_id])}
            />
          </p>

          <p style={{ marginTop: 6 }}>{msg.content}</p>

          <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
            {new Date(msg.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </main>
  );
}
