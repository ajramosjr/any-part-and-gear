"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

export default function SendMessagePage() {
  const params = useSearchParams();
  const router = useRouter();

  const partId = params.get("partId");
  const sellerId = params.get("sellerId");

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("messages").insert({
      content,
      sender_id: user.id,
      receiver_id: sellerId,
      part_id: partId,
    });

    if (!error) {
      router.push("/inbox");
    }

    setLoading(false);
  };

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 600 }}>
        <h1>Message Seller</h1>

        <textarea
          placeholder="Write your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            height: 120,
            padding: 12,
            borderRadius: 10,
            marginTop: 16,
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !content}
          style={{
            marginTop: 16,
            padding: "10px 16px",
            borderRadius: 10,
            background: "#0f172a",
            color: "#facc15",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </main>
    </RequireAuth>
  );
}
