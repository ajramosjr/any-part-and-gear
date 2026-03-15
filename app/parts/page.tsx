"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  price: number;
  platform: string;
  category: string;
  trade_available: boolean;
  image_urls: string[] | null;
};
const categories = [
  "All",
  "Brakes",
  "Engine",
  "Suspension",
  "Electrical",
  "Body",
  "Interior",
  "Drivetrain",
  "Other",
];

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [tradeOnly, setTradeOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        const { data } = await supabase
          .from("favorites")
          .select("part_id")
          .eq("user_id", user.id);

        setFavorites(data?.map((f) => f.part_id) || []);
      }

      fetchParts();
    };

    init();
  }, [activeCategory, tradeOnly]);

  const fetchParts = async () => {
    setLoading(true);

    let query = supabase
      .from("parts")
      .select("*")
      .order("created_at", { ascending: false });

    if (activeCategory !== "All") {
      query = query.eq("category", activeCategory);
    }

    if (tradeOnly) {
      query = query.eq("trade_available", true);
    }

    const { data } = await query;
    setParts(data || []);
    setLoading(false);
  };

  const toggleFavorite = async (partId: number) => {
    if (!userId) {
      alert("Please sign in to save listings.");
      return;
    }

    const isSaved = favorites.includes(partId);

    if (isSaved) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("part_id", partId);

      setFavorites((prev) => prev.filter((id) => id !== partId));
    } else {
      await supabase.from("favorites").insert({
        user_id: userId,
        part_id: partId,
      });

      setFavorites((prev) => [...prev, partId]);
    }
  };

  if (loading) {
    return <div className="p-6">Loading parts...</div>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Parts Marketplace</h1>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 border rounded ${
              activeCategory === cat ? "bg-black text-white" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Trade Toggle */}
      <label className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          checked={tradeOnly}
          onChange={() => setTradeOnly(!tradeOnly)}
        />
        Trade Only
      </label>

      {/* Listings */}
      {parts.length === 0 ? (
        <p className="text-gray-500">No listings found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {parts.map((part) => {
            const isSaved = favorites.includes(part.id);

            return (
              <div key={part.id} className="border rounded p-4">
                {part.image_urls?.[0] && (
                  <img
                    src={part.image_urls[0]}
                    alt={part.title}
                    className="w-full h-40 object-cover mb-3 rounded"
                  />
                )}
<Link href={`/user/${part.user_id}`}>
  View Seller Profile
</Link>
                <Link href={`/parts/${part.id}`}>
                  <h2 className="font-semibold hover:underline">
                    {part.title}
                  </h2>
                </Link>

                <p className="text-sm text-gray-600">{part.platform}</p>

                <p className="font-bold mt-2">${part.price}</p>

                {part.trade_available && (
                  <p className="text-xs text-green-600">Trade Available</p>
                )}

                <button
                  onClick={() => toggleFavorite(part.id)}
                  className="mt-3 text-sm"
                >
                  {isSaved ? "★ Saved" : "☆ Save"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
