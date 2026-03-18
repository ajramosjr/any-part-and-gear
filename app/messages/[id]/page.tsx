"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Message = {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
};

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const conversationId = params.id;
  const router = useRouter();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Auth check — redirect to login if not authenticated
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setCurrentUserId(user.id);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!conversationId) return;

    // Load existing messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, body, sender_id, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
      setLoading(false);
    };

    loadMessages();

    // Real-time subscription — use a unique channel name per conversation
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
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

  // Auto-scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || !currentUserId) return;

    setSending(true);
    setText("");

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      body: trimmed,
    });

    // Update last_message on the conversation for the inbox preview
    await supabase
      .from("conversations")
      .update({
        last_message: trimmed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading conversation…</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-4 flex flex-col h-[calc(100vh-160px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/messages"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Messages
        </Link>
        <h1 className="text-xl font-bold">Conversation</h1>
      </div>

      {/* Message list */}
      <div className="flex-1 border rounded-xl p-4 overflow-y-auto bg-gray-50 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-8">
            No messages yet. Say hello! 👋
          </p>
        )}

        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  isMine
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white text-gray-900 rounded-bl-sm border"
                }`}
              >
                <p>{msg.body}</p>
                <p
                  className={`text-xs mt-1 ${
                    isMine ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <input
          className="border flex-1 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message… (Enter to send)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          className="bg-blue-600 text-white px-5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-40 transition"
        >
          {sending ? "…" : "Send"}
        </button>
      </div>
    </main>
  );
}
