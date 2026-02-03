"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: string;
  title: string;
  image_url: string | null;
  user_id: string;
};

export default function TradeOfferPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const partId = params.partId as string;

  const [part, setPart] = useState<Part | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("id, title, image_url, user_id")
        .eq("id", partId)
        .single();

      if (!error) {
        setPart(data);
      }

      setLoading(false);
    };

    fetchPart();
  }, [partId, supabase]);

  const sendTradeOffer = async () => {
    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !part) {
      setSending(false);
      return;
    }

    const { error } = await supabase.from("trade_offers").insert({
      sender_id: user.id,
      receiver_id: part.user_id,
      part_id: part.id,
      message,
      status: "pending",
    });

    setSending(false);

    if (!error) {
      router.push("/trades");
    }
  };

  if (loading) {
    return <p className="p-6">Loading…</p>;
  }

  if (!part) {
    return <p className="p-6">Part not found.</p>;
  }

  const imageSrc =
    part.image_url && part.image_url.trim() !== ""
      ? part.image_url
      : "/logo.png";

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Send Trade Offer</h1>

      <div className="border rounded-lg p-4 mb-6">
        <Image
          src={imageSrc}
          alt={part.title}
          width={400}
          height={300}
          className="rounded mb-3 object-contain bg-gray-50"
        />
        <h2 className="font-semibold">{part.title}</h2>
      </div>

      <label className="block font-medium mb-2">
        Message to seller
      </label>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What are you offering in trade?"
        className="w-full border rounded p-3 mb-4 min-h-[120px]"
      />

      <button
        onClick={sendTradeOffer}
        disabled={sending || message.trim() === ""}
        className="w-full bg-slate-900 text-white py-3 rounded disabled:opacity-50"
      >
        {sending ? "Sending…" : "Send Trade Offer"}
      </button>
    </main>
  );
}
