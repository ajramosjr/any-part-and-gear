"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

type Part = {
  id: number;
  title: string;
  price: number;
  image_urls: string[] | null;
};

export default function HomePage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParts = async () => {
      const { data } = await supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(9);

      setParts(data || []);
      setLoading(false);
    };

    fetchParts();
  }, []);

  if (loading) {
    return <div className="p-6">Loading listings...</div>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Latest Listings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {parts.map((part) => (
          <Link
            key={part.id}
            href={`/parts/${part.id}`}
            className="border rounded p-4 hover:shadow"
          >
            {part.image_urls?.[0] && (
              <img
                src={part.image_urls[0]}
                alt={part.title}
                className="w-full h-40 object-cover mb-3 rounded"
              />
            )}

            <h2 className="font-semibold">{part.title}</h2>
            <p className="font-bold mt-2">${part.price}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
