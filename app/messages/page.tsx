"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Conversation = {
  id: string;
  part_id: number;
  last_message: string;
  updated_at: string;
  buyer_id: string;
  seller_id: string;
};

export default function MessagesPage() {

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchConversations = async () => {

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (!error && data) {
        setConversations(data);
      }

      setLoading(false);
    };

    fetchConversations();

  }, []);

  if (loading) {
    return <p className="p-6">Loading messages…</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Messages
      </h1>

      {conversations.length === 0 && (
        <p className="text-gray-500">
          No conversations yet.
        </p>
      )}

      {conversations.map((conv) => (

        <Link
          key={conv.id}
          href={`/messages/${conv.id}`}
          className="block
