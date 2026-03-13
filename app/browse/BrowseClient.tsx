"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  price: number | null;
  images: string[] | null;
};

export default function BrowseClient() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("id, title, price, images")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading parts:", error);
      }

      setParts(data ?? []);
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

      {parts.length === 0 && (
        <p className="text-gray-500">No parts available.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {parts.map((part) => (
          <Link
            key={part.id}
            href={`/parts/${part.id}`}
            className="border rounded-lg p-4 hover:shadow"
          >
            <img
              src={part.images?.[0] || "/placeholder-part.png"}
              alt={part.title}
              className="w-full h-40 object-cover rounded mb-3"
            />

            <h3 className="font-semibold">{part.title}</h3>

            {part.price !== null && (
              <p className="text-sm text-gray-600 mt-1">
                ${part.price}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
