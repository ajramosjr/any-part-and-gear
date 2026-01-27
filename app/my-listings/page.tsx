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

export default function MyListingsPage() {
  const supabase = createClient();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("parts")
        .select("id, title, price, images")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchMyListings();
  }, [supabase]);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <p>Loading your listings…</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>

        <Link
          href="/sell"
          className="bg-[#0b1f3a] text-white px-4 py-2 rounded hover:opacity-90"
        >
          + Sell a Part
        </Link>
      </div>

      {parts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">
            You haven’t listed any parts yet.
          </p>
          <Link
            href="/sell"
            className="inline-block bg-[#0b1f3a] text-white px-6 py-3 rounded"
          >
            List Your First Part
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {parts.map((part) => (
            <Link
              key={part.id}
              href={`/parts/${part.id}`}
              className="border rounded-lg p-4 hover:shadow transition"
            >
              <img
                src={part.images?.[0] || "/images/apg-placeholder.png"}
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
      )}
    </main>
  );
}
