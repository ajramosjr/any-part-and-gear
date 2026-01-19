"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      setMessages(data || []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <p style={{ padding: 40 }}>Loading messages…</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Messages</h1>

      {messages.map((m) => (
        <Link
          key={m.id}
          href={`/messages/${m.part_id}`}
          style={{ display: "block", marginBottom: 10 }}
        >
          {m.content}
        </Link>
      ))}
    </div>
  );
}
