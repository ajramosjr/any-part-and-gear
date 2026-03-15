"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  price: number | null;
  description: string | null;
  image_url: string | null;
  user_id: string;
};

export default function PartPage() {

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchPart = async () => {

      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setPart(data);
      }

      setLoading(false);
    };

    fetchPart();

  }, [id]);

  const startConversation = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!part) return;

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        part_id: part.id,
        buyer_id: user.id,
        seller_id: part.user_id,
        last_message: "Hi, is this still available?"
      })
      .select()
      .single();

    if (!error && data) {
      router.push(`/messages/${data.id}`);
    }

  };

  if (loading) {
    return <p className="p-6">Loading part...</p>;
  }

  if (!part) {
    return <p className="p-6">Part not found.</p>;
  }

  return (

    <main className="max-w-4xl mx-auto p-6">

      <div className="grid md:grid-cols-2 gap-8">

        <div>
          <Image
            src={part.image_url || "/placeholder.png"}
            alt={part.title}
            width={600}
            height={400}
            className="rounded-lg"
          />
        </div>

        <div>

          <h1 className="text-3xl font-bold mb-4">
            {part.title}
          </h1>

          {part.price && (
            <p className="text-xl text-green-600 mb-4">
              ${part.price}
            </p>
          )}

          <p className="text-gray-700 mb-6">
            {part.description}
          </p>

          <button
            onClick={startConversation}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Message Seller
          </button>

        </div>

      </div>

    </main>

  );
}
