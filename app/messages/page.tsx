"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

type Conversation = {
  part_id: string;
  part_title: string;
  last_message: string;
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

      /**
       * This assumes you have a view or query that groups messages by part.
       * If you DON’T yet, this will still compile safely.
       */
      const { data, error } = await supabase
        .from("trade_conversations")
        .select("*")
        .order("updated_at", { ascending: false });

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

      {conversations.map((conv) => (
        <Link
          key={conv.part_id}
          href={`/messages/${conv.part_id}`}
          className="block border rounded-lg p-4 mb-4 hover:bg-gray-50"
        >
          <h3 className="font-semibold">{conv.part_title}</h3>
          <p className="text-sm text-gray-600 truncate">
            {conv.last_message}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(conv.updated_at).toLocaleString()}
          </p>
        </Link>
      ))}
    </main>
  );
}
