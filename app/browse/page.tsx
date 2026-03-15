"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  price: number;
  image_url: string | null;
};

export default function BrowsePage() {

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchParts = async () => {

      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchParts();

  }, []);

  if (loading) {
    return <p className="p-6">Loading parts...</p>;
  }

  return (

    <main className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Browse Parts
      </h1>

      {parts.length === 0 && (
        <p>No listings yet.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">

        {parts.map((part) => (

          <Link
            key={part.id}
            href={`/parts/${part.id}`}
            className="border rounded-lg p-4 hover:shadow block"
          >

            <img
              src={part.image_url || "/placeholder.png"}
              className="rounded mb-3 w-full h-40 object-cover"
              alt={part.title}
            />

            <h3 className="font-semibold">
              {part.title}
            </h3>

            <p className="text-gray-500">
              ${part.price}
            </p>

          </Link>

        ))}

      </div>

    </main>
  );
}
