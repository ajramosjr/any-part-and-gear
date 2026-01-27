"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

type Conversation = {
  id: string;
  part_id: string;
  part_title: string;
  last_message: string | null;
  updated_at: string;
};

export default function MessagesPage() {
  const supabase = createClient();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("trade_conversations")
        .select("*")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      console.log("Logged in user:", user.id);
      console.log("Conversations:", data);
      console.log("Conversation error:", error);

      if (!error && data) {
        setConversations(data);
      }

      setLoading(false);
    };

    fetchConversations();
  }, [supabase]);

  if (loading) {
    return <p className="p-6">Loading messages…</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {conversations.length === 0 && (
        <p className="text-gray-500">No conversations yet.</p>
      )}

      <div className="space-y-4">
        {conversations.map((c) => (
          <Link
            key={c.id}
            href={`/messages/${c.part_id}`}
            className="block border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between">
              <h2 className="font-semibold">{c.part_title}</h2>
              <span className="text-xs text-gray-400">
                {new Date(c.updated_at).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-1">
              {c.last_message || "No messages yet"}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
