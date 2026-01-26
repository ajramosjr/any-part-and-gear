"use client";

export const dynamic = "force-dynamic";

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
  const supabase = createClient();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [supabase]);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <p className="text-gray-500">Loading parts…</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#1e2a44]">
        Browse Parts
      </h1>

      {/* EMPTY STATE */}
      {parts.length === 0 && (
        <div className="text-center py-20">
          <img
            src="/placeholder-part.png"
            alt="Any-Part & Gear"
            className="mx-auto h-24 mb-6"
          />
          <p className="text-lg font-semibold text-[#1e2a44]">
            No parts listed yet
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Be the first to post a part on Any-Part & Gear
          </p>
        </div>
      )}

      {/* PART GRID */}
      {parts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {parts.map((part) => (
            <Link
              key={part.id}
              href={`/parts/${part.id}`}
              className="border rounded-lg p-4 hover:shadow-md transition bg-white"
            >
              <img
                src={part.images?.[0] || "/placeholder-part.png"}
                alt={part.title}
                className="w-full h-40 object-cover rounded mb-3"
              />

              <h3 className="font-semibold text-[#1e2a44]">
                {part.title}
              </h3>

              {part.price !== null && (
                <p className="text-sm text-gray-600 mt-1">
                  ${part.price}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
