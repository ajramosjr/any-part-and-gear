"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
};

export default function ChatPage() {

  const params = useParams<{ id: string }>();
  const conversationId = params.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {

    const loadMessages = async () => {

      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);

    };

    loadMessages();

    // REAL TIME SUBSCRIPTION
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [conversationId]);

  const sendMessage = async () => {

    if (!text) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: text
    });

    setText("");

  };

  return (

    <main className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Conversation
      </h1>

      <div className="border rounded-lg p-4 h-[400px] overflow-y-auto mb-4">

        {messages.length === 0 && (
          <p className="text-gray-500">No messages yet.</p>
        )}

        {messages.map((msg) => (

          <div key={msg.id} className="mb-3">

            <p className="bg-gray-100 p-3 rounded-lg inline-block">
              {msg.body}
            </p>

            <p className="text-xs text-gray-400">
              {new Date(msg.created_at).toLocaleTimeString()}
            </p>

          </div>

        ))}

      </div>

      <div className="flex gap-2">

        <input
          className="border flex-1 p-3 rounded-lg"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-6 rounded-lg"
        >
          Send
        </button>

      </div>

    </main>
  );
}
