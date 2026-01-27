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
};

export default function HomePage() {
  const supabase = createClient();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("id, title, price, image_url")
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
            width={120}
            height={120}
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          A marketplace to buy, sell, and trade parts
        </h1>

        <p className="text-slate-600 mb-8">
          Find new and used auto parts from trusted sellers
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/browse" className="px-6 py-3 bg-slate-900 text-white rounded-lg">
            Browse Parts
          </Link>
          <Link href="/sell" className="px-6 py-3 border rounded-lg">
            Sell a Part
          </Link>
        </div>
      </section>

      {/* LATEST PARTS */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Parts</h2>

        {loading && <p>Loading parts…</p>}

        {!loading && parts.length === 0 && (
          <p className="text-gray-500">No parts listed yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {parts.map((part) => (
            <div
              key={part.id}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              <Image
                src={part.image_url || "/images/apg-placeholder.png"}
                alt={part.title}
                width={400}
                height={300}
                className="rounded mb-3 object-cover"
              />

              <h3 className="font-semibold">{part.title}</h3>

              {part.price !== null && (
                <p className="text-slate-700">${part.price}</p>
              )}

              <div className="flex gap-2 mt-3">
                <Link
                  href={`/parts/${part.id}`}
                  className="flex-1 text-center border rounded py-2"
                >
                  View
                </Link>

                <Link
                  href={`/trade/${part.id}`}
                  className="flex-1 text-center bg-slate-900 text-white rounded py-2"
                >
                  Trade
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
