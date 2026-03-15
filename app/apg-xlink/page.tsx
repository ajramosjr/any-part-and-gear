"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {

  const [open, setOpen] = useState<string | null>(null);

  const toggle = (cat: string) => {
    setOpen(open === cat ? null : cat);
  };

  return (
    <main className="max-w-6xl mx-auto p-6">

      {/* HERO */}
      <section className="text-center py-12">

        <h1 className="text-4xl font-bold text-blue-800">
          Find Rare Parts & Trusted Sellers
        </h1>

        <p className="text-gray-500 mt-2">
          Powered by{" "}
          <Link
            href="/apg-xlink"
            className="text-blue-600 hover:underline font-semibold"
          >
            A.P.G X-Link
          </Link>
        </p>

        <div className="flex justify-center mt-6">
          <input
            className="border rounded-l-lg px-4 py-3 w-full max-w-lg"
            placeholder="Search parts, vehicles, or gear..."
          />

          <button className="bg-yellow-500 text-white px-6 rounded-r-lg">
            Search
          </button>
        </div>

      </section>

      {/* CATEGORIES */}
      <section className="mt-12">

        <h2 className="text-2xl font-bold mb-6">
          Browse Categories
        </h2>

        <div className="space-y-4">

          {/* CARS */}
          <div className="border rounded-xl p-6">
            <button onClick={() => toggle("cars")} className="font-semibold w-full text-left">
              🚗 Cars
            </button>

            {open === "cars" && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Link href="/category/cars/engine">Engine Parts</Link>
                <Link href="/category/cars/wheels">Wheels & Tires</Link>
                <Link href="/category/cars/interior">Interior</Link>
                <Link href="/category/cars/electronics">Electronics</Link>
              </div>
            )}
          </div>

          {/* BOATS */}
          <div className="border rounded-xl p-6">
            <button onClick={() => toggle("boats")} className="font-semibold w-full text-left">
              🚤 Boats
            </button>

            {open === "boats" && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Link href="/category/boats/propellers">Propellers</Link>
                <Link href="/category/boats/electronics">Marine Electronics</Link>
                <Link href="/category/boats/anchors">Anchors</Link>
                <Link href="/category/boats/safety">Safety Gear</Link>
              </div>
            )}
          </div>

          {/* TOOLS */}
          <div className="border rounded-xl p-6">
            <button onClick={() => toggle("tools")} className="font-semibold w-full text-left">
              🛠 Tools
            </button>

            {open === "tools" && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Link href="/category/tools/hand">Hand Tools</Link>
                <Link href="/category/tools/power">Power Tools</Link>
                <Link href="/category/tools/diagnostic">Diagnostic Tools</Link>
                <Link href="/category/tools/lifts">Lifts & Jacks</Link>
              </div>
            )}
          </div>

          {/* RC */}
          <div className="border rounded-xl p-6">
            <button onClick={() => toggle("rc")} className="font-semibold w-full text-left">
              🏎 RC Vehicles
            </button>

            {open === "rc" && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Link href="/category/rc/engines">RC Engines</Link>
                <Link href="/category/rc/batteries">Batteries</Link>
                <Link href="/category/rc/tires">RC Tires</Link>
                <Link href="/category/rc/controllers">Controllers</Link>
              </div>
            )}
          </div>

        </div>

      </section>

    </main>
  );
}
