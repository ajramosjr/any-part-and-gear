"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

export default function ConversationPage() {
  const params = useParams();
  const partId = params.partid as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

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
        .from("trade_messages")
        .select("*")
        .eq("part_id", partId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }

      setLoading(false);
    };

    fetchMessages();
  }, [partId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("trade_messages")
      .insert({
        part_id: partId,
        sender_id: user.id,
        message: newMessage,
      })
      .select()
      .single();

    if (!error && data) {
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    }
  };

  if (loading) {
    return <p className="p-6">Loading conversation…</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      <div className="border rounded-lg p-4 mb-4 max-h-[400px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-500">No messages yet.</p>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="mb-3">
            <p className="text-sm text-gray-500">
              {new Date(msg.created_at).toLocaleString()}
            </p>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </main>
  );
}
