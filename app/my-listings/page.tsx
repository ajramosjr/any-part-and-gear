"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  price: number | null;
  image_url: string | null;
};

export default function MyListingsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("parts")
        .select("id, title, price, image_url")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchParts();
  }, []);

  if (loading) {
    return <p className="p-6">Loading your listings...</p>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Listings</h1>

      {parts.length === 0 && (
        <p className="text-gray-500">No listings yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {parts.map((part) => (
          <Link
            key={part.id}
            href={`/parts/${part.id}`}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <Image
              src={part.image_url || "/placeholder.png"}
              alt={part.title}
              width={400}
              height={300}
              className="rounded mb-3 w-full h-40 object-cover"
            />

            <h3 className="font-semibold">{part.title}</h3>

            {part.price && (
              <p className="text-gray-700">${part.price}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
