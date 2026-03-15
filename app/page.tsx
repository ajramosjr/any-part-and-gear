"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {

  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (!search) return;
    router.push(`/browse?search=${encodeURIComponent(search)}`);
  };
const [parts, setParts] = useState<any[]>([]);

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

      {/* Hero Section */}
      <div className="text-center mb-10">

        <h1 className="text-4xl font-bold text-blue-900">
          Find rare parts, local deals, and trusted sellers.

The smarter marketplace for car, boat, and gear enthusiasts.
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

        {/* Search */}
        <div className="flex mt-6 justify-center">

          <input
            type="text"
            placeholder="Search parts, vehicles, or gear..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 w-96 rounded-l-lg"
          />

          <button
            onClick={handleSearch}
            className="bg-yellow-500 text-white px-6 rounded-r-lg hover:bg-yellow-400"
          >
            Search
          </button>

        </div>
      </div>

      {/* Categories */}

      <h2 className="text-2xl font-semibold mb-4">
        Browse Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

        <Link href="/category/cars" className="border rounded-lg p-6 text-center hover:shadow block">
          🚗 Cars
        </Link>

        <Link href="/category/boats" className="border rounded-lg p-6 text-center hover:shadow block">
          🚤 Boats
        </Link>

        <Link href="/category/marine" className="border rounded-lg p-6 text-center hover:shadow block">
          ⚓ Marine
        </Link>

        <Link href="/category/tools" className="border rounded-lg p-6 text-center hover:shadow block">
          🛠 Tools
        </Link>

        <Link href="/category/machinery" className="border rounded-lg p-6 text-center hover:shadow block">
          🏗 Machinery
        </Link>

        <Link href="/category/rc" className="border rounded-lg p-6 text-center hover:shadow block">
          🏎 RC Vehicles
        </Link>

        <Link href="/category/rv" className="border rounded-lg p-6 text-center hover:shadow block">
          🚐 RV Vehicles
        </Link>

        <Link href="/category/buses" className="border rounded-lg p-6 text-center hover:shadow block">
          🚌 Buses
        </Link>

      </div>

      {/* AI Scan Section */}

      <section className="mt-14 mb-12">

        <div className="bg-blue-900 text-white rounded-2xl p-10 text-center">

          <h2 className="text-3xl font-bold mb-3">
            Scan Your Vehicle With AI
          </h2>

          <p className="text-gray-200 mb-6">
            Take a photo of your car, boat, or RC vehicle and instantly discover
            compatible parts, maintenance tips, and upgrade ideas.
          </p>

          <Link
            href="/ai-scan"
            className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400"
          >
            Scan Your Vehicle
          </Link>

        </div>

      </section>

      {/* Trending Parts */}

      <h2 className="text-2xl font-bold mb-4">
        🔥 Trending Parts
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">

        <Link href="/parts/1" className="border rounded-xl p-4 hover:shadow-lg transition block">

          <img
            src="/placeholder.png"
            alt="Ford F150 Headlights"
            className="rounded mb-3 w-full h-40 object-cover"
          />

          <h3 className="font-semibold">
            Ford F150 Headlights
          </h3>

          <p className="text-gray-500">
            $140
          </p>

        </Link>

        <Link href="/parts/2" className="border rounded-xl p-4 hover:shadow-lg transition block">

          <img
            src="/placeholder.png"
            alt="Chevy Silverado Tailgate"
            className="rounded mb-3 w-full h-40 object-cover"
          />

          <h3 className="font-semibold">
            Chevy Silverado Tailgate
          </h3>

          <p className="text-gray-500">
            $300
          </p>

        </Link>

        <Link href="/parts/3" className="border rounded-xl p-4 hover:shadow-lg transition block">

          <img
            src="/placeholder.png"
            alt="Yamaha Jet Ski Pump"
            className="rounded mb-3 w-full h-40 object-cover"
          />

          <h3 className="font-semibold">
            Yamaha Jet Ski Pump
          </h3>

          <p className="text-gray-500">
            $180
          </p>

        </Link>

        <Link href="/parts/4" className="border rounded-xl p-4 hover:shadow-lg transition block">

          <img
            src="/placeholder.png"
            alt="Traxxas RC Motor"
            className="rounded mb-3 w-full h-40 object-cover"
          />

          <h3 className="font-semibold">
            Traxxas RC Motor
          </h3>

          <p className="text-gray-500">
            $90
          </p>

        </Link>

      </div>

      {/* Featured Listings */}

      <h2 className="text-2xl font-semibold mb-4">
        Featured Listings
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <Link href="/parts/5" className="border rounded-lg p-4 hover:shadow block">

          <img
            src="/placeholder.png"
            alt="Ford Mustang GT Exhaust"
            className="rounded mb-3 w-full h-40 object-cover"
          />

          <h3 className="font-semibold">
            Ford Mustang GT Exhaust
          </h3>

          <p className="text-gray-500">
            $250
          </p>

        </Link>

        <Link href="/parts/6" className="border rounded-lg p-4 hover:shadow block">

          <img
            src="/placeholder.png"
            alt="Yamaha Boat Propeller"
            className="rounded mb-3 w-full h-40 object-cover"
          />

          <h3 className="font-semibold">
            Yamaha Boat Propeller
          </h3>

          <p className="text-gray-500">
            $180
          </p>

        </Link>

        <Link href="/parts/7" className="border rounded-lg p-4 hover:shadow block">

          <img
            src="/placeholder.png"
            alt="Traxxas RC Engine"
            className="rounded mb-3 w-full h-40 object-cover"
          />

          <h3 className="font-semibold">
            Traxxas RC Engine
          </h3>

          <p className="text-gray-500">
            $120
          </p>

        </Link>

      </div>

    </main>
  );
}
