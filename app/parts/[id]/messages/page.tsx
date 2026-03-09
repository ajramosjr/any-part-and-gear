"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RequireAuth from "@/app/components/RequireAuth";
import { createClient } from "@/lib/supabaseClient";

type Message = {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
};

export default function PartMessagesPage() {
  const params = useParams();
  const partId = Number(params.id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (!partId) return;

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
        .select("*")
        .eq("part_id", partId)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }

      setLoading(false);
    };

    fetchMessages();
  }, [partId]);

  if (loading) {
    return <p className="p-6">Loading messages…</p>;
  }

  return (
    <RequireAuth>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        {messages.length === 0 && (
          <p className="text-gray-500">No messages yet.</p>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="border rounded-lg p-3 text-sm"
            >
              <p>{msg.message}</p>

              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </RequireAuth>
  );
}
