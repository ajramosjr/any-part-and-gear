"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  price: number | null;
  images: string[] | null;
};

export default function BrowsePage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("id, title, price, images")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchParts();
  }, []);

  if (loading) {
    return <p className="p-6">Loading parts…</p>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Browse Parts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map((part) => (
          <Link
            key={part.id}
            href={`/parts/${part.id}`}
            className="border rounded-lg p-4 hover:shadow transition"
          >
            <h2 className="font-semibold">{part.title}</h2>

            {part.price !== null && (
              <p className="text-sm text-gray-600">${part.price}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
