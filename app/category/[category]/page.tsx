"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { Part } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  cars: "🚗 Cars",
  boats: "🚤 Boats",
  marine: "⚓ Marine",
  tools: "🛠 Tools",
  machinery: "🏗 Machinery",
  rc: "🏎 RC Vehicles",
  rv: "🚐 RV",
  buses: "🚌 Buses",
};

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const category = params.category;

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    const fetchParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchParts();
  }, [category]);

  const label = CATEGORY_LABELS[category] ?? category;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/browse" className="hover:underline">
          Browse
        </Link>{" "}
        → <span className="capitalize">{label}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8 capitalize">{label}</h1>

      {loading && <p className="text-gray-500">Loading listings…</p>}

      {!loading && parts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            No listings in this category yet.
          </p>
          <Link
            href="/sell"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Be the first to sell
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {parts.map((part) => (
          <Link
            key={part.id}
            href={`/parts/${part.id}`}
            className="border rounded-xl p-4 hover:shadow-lg transition bg-white block"
          >
            {part.image_url && (
              <img
                src={part.image_url}
                alt={part.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            <h3 className="font-semibold text-lg">{part.title}</h3>

            {part.vehicle && (
              <p className="text-xs text-gray-400 mt-1">Fits: {part.vehicle}</p>
            )}

            {part.condition && (
              <p className="text-xs text-gray-500 capitalize mt-1">
                {part.condition}
              </p>
            )}

            {part.price !== null && (
              <p className="text-green-600 font-bold mt-2">${part.price}</p>
            )}

            {part.trade_available && (
              <p className="text-xs text-blue-500 mt-1">Trade available</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
