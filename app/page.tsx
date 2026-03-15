"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();
  const [search, setSearch] = useState("");
  const [parts, setParts] = useState<any[]>([]);

  const handleSearch = () => {
    if (!search) return;
    router.push(`/browse?search=${encodeURIComponent(search)}`);
  };

  useEffect(() => {
    const loadParts = async () => {
      const { data } = await supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (data) setParts(data);
    };

    loadParts();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">

      {/* HERO */}
      <div className="text-center mb-12">

        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Find rare parts, local deals, and trusted sellers
        </h1>

        <p className="text-gray-600">
          The smarter marketplace for car, boat, and gear enthusiasts
        </p>

        <p className="text-gray-500 mt-2">
          Powered by{" "}
          <Link
            href="/apg-xlink"
            className="text-blue-600 hover:underline font-semibold"
          >
            A.P.G X-Link
          </Link>
        </p>

        {/* SEARCH */}
        <div className="flex justify-center mt-6">

          <input
            type="text"
            placeholder="Search parts, vehicles, or gear..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 w-80 rounded-l-lg"
          />

          <button
            onClick={handleSearch}
            className="bg-yellow-500 text-white px-6 rounded-r-lg hover:bg-yellow-400"
          >
            Search
          </button>

        </div>

      </div>

      {/* CATEGORIES */}

      <h2 className="text-2xl font-semibold mb-6">
        Browse Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">

        <Link href="/category/cars" className="border rounded-lg p-6 text-center hover:shadow">
          🚗 Cars
        </Link>

        <Link href="/category/boats" className="border rounded-lg p-6 text-center hover:shadow">
          🚤 Boats
        </Link>

        <Link href="/category/marine" className="border rounded-lg p-6 text-center hover:shadow">
          ⚓ Marine
        </Link>

        <Link href="/category/tools" className="border rounded-lg p-6 text-center hover:shadow">
          🛠 Tools
        </Link>

        <Link href="/category/machinery" className="border rounded-lg p-6 text-center hover:shadow">
          🏗 Machinery
        </Link>

        <Link href="/category/rc" className="border rounded-lg p-6 text-center hover:shadow">
          🏎 RC Vehicles
        </Link>

        <Link href="/category/rv" className="border rounded-lg p-6 text-center hover:shadow">
          🚐 RV Vehicles
        </Link>

        <Link href="/category/buses" className="border rounded-lg p-6 text-center hover:shadow">
          🚌 Buses
        </Link>

      </div>

      {/* RECENT LISTINGS */}

      <h2 className="text-2xl font-bold mb-6">
        Recent Listings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">

        {parts.map((part) => (
          <Link
            key={part.id}
            href={`/parts/${part.id}`}
            className="border rounded-xl p-4 hover:shadow-lg transition bg-white"
          >

            <h3 className="font-semibold text-lg">
              {part.title}
            </h3>

            {part.price && (
              <p className="text-green-600 font-bold mt-2">
                ${part.price}
              </p>
            )}

          </Link>
        ))}

      </div>

      {/* AI SCAN */}

      <section className="mb-12">

        <div className="bg-blue-900 text-white rounded-2xl p-10 text-center">

          <h2 className="text-3xl font-bold mb-3">
            Scan Your Vehicle With AI
          </h2>

          <p className="text-gray-200 mb-6">
            Take a photo of your car, boat, or RC vehicle and instantly discover compatible parts and maintenance tips.
          </p>

          <Link
            href="/ai-scan"
            className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400"
          >
            Scan Your Vehicle
          </Link>

        </div>

      </section>

    </main>
  );
}
