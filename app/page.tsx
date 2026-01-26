"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6">
      
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center py-20">
        <img
          src="/images/apg-placeholder.png"
          alt="Any-Part & Gear"
          className="h-28 mb-6"
        />

        <h1 className="text-2xl font-bold text-[#0b1f3b] mb-2">
          A marketplace to buy, sell, and trade parts
        </h1>

        <p className="text-gray-500 max-w-xl">
          Find new and used auto parts from trusted sellers
        </p>

        <div className="flex gap-4 mt-6">
          <Link
            href="/browse"
            className="px-6 py-2 rounded bg-[#0b1f3b] text-white font-medium hover:opacity-90"
          >
            Browse Parts
          </Link>

          <Link
            href="/sell"
            className="px-6 py-2 rounded border border-[#0b1f3b] text-[#0b1f3b] font-medium hover:bg-gray-100"
          >
            Sell a Part
          </Link>
        </div>
      </section>

      {/* LATEST PARTS HEADER */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-[#0b1f3b] mb-4">
          Latest Parts
        </h2>

        <p className="text-gray-500">
          New listings will appear here.
        </p>
      </section>

    </main>
  );
}
