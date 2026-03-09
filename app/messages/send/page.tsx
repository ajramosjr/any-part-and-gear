"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

export default function SendMessagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const partId = searchParams.get("partId");
  const receiverId = searchParams.get("receiverId");

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const supabase = createClient();

  const sendMessage = async () => {
    if (!message.trim() || !partId || !receiverId) return;

    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSending(false);
      return;
    }

    await supabase.from("messages").insert({
      part_id: partId,
      sender_id: user.id,
      receiver_id: receiverId,
      content: message,
    });

    setSending(false);
    router.push("/messages");
  };

  return (
    <RequireAuth>
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Send Message</h1>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message…"
          className="w-full border rounded-lg p-3 mb-4 min-h-[120px]"
        />

        <button
          onClick={sendMessage}
          disabled={sending}
          className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </main>
    </RequireAuth>
  );
}
