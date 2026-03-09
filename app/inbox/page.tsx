"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import VerifiedBadge from "@/components/VerifiedBadge";

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  profiles: {
    username: string;
    verified: boolean;
  }[];
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          sender_id,
          created_at,
          profiles (
            username,
            verified
          )
        `)
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setMessages(data);
      }

      setLoading(false);
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <p className="p-6">Loading inbox…</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Inbox</h1>

      {messages.length === 0 && (
        <p className="text-gray-500">No messages yet.</p>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className="border rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <strong>{msg.profiles?.[0]?.username ?? "Unknown"}</strong>
            {msg.profiles?.[0]?.verified && <VerifiedBadge />}
          </div>

          <p className="mb-2">{msg.content}</p>

          <p className="text-xs text-gray-500">
            {new Date(msg.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </main>
  );
}
