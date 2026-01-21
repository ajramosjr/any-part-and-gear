"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

export default function ReplyPage() {
  const params = useSearchParams();
  const router = useRouter();

  const receiverId = params.get("to");
  const partId = params.get("partId");

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const sendReply = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: receiverId,
      part_id: partId,
      content,
    });

    if (!error) {
      router.push("/inbox");
    }

    setLoading(false);
  };

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 600 }}>
        <h1>Reply</h1>

        <textarea
          placeholder="Write your reply..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            height: 140,
            padding: 14,
            borderRadius: 12,
            marginTop: 16,
          }}
        />

        <button
          onClick={sendReply}
          disabled={!content || loading}
          style={{
            marginTop: 16,
            padding: "12px 18px",
            borderRadius: 12,
            background: "#0f172a",
            color: "#facc15",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          Send Reply
        </button>
      </main>
    </RequireAuth>
  );
}
