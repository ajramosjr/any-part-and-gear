"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";

type Part = {
  id: string;
  title: string;
  price: number | null;
  image_url: string | null;
  created_at: string;
};

export default function HomePage() {
  const supabase = createClient();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("id, title, price, image_url, created_at")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchLatestParts();
  }, [supabase]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* HERO */}
      <section className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Any-Part & Gear"
            width={200}
            height={200}
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          A marketplace to buy, sell, and trade parts
        </h1>

        <p className="text-slate-600 mb-8">
          Find new and used auto parts from trusted sellers
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/browse"
            className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium"
          >
            Browse Parts
          </Link>

          <Link
            href="/sell"
            className="px-6 py-3 border border-slate-300 rounded-lg font-medium"
          >
            Sell a Part
          </Link>

          <Link
            href="/trade"
            className="px-6 py-3 border border-slate-900 rounded-lg font-medium"
          >
            Trade a Part
          </Link>
        </div>
      </section>

      {/* LATEST PARTS */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Latest Parts</h2>
        <p className="text-slate-500 mb-6">
          Recently added listings
        </p>

        {loading && (
          <p className="text-slate-500">Loading parts…</p>
        )}

        {!loading && parts.length === 0 && (
          <p className="text-slate-500">
            No listings yet. Be the first to sell a part.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {parts.map((part) => (
            <Link
              key={part.id}
              href={`/parts/${part.id}`}
              className="border rounded-xl overflow-hidden hover:shadow-md transition"
            >
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={part.image_url || "/images/apg-placeholder.png"}
                  alt={part.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-medium text-slate-900 mb-1">
                  {part.title}
                </h3>

                <p className="text-slate-700 font-semibold">
                  {part.price ? `$${part.price}` : "Trade / Offer"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {parts.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/browse"
              className="text-slate-900 font-medium underline"
            >
              View all parts →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
