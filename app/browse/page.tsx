"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Part = {
  id: number;
  title: string;
  price: number | null;
  images: string[] | null;
  category: string | null;
};

const CATEGORIES = [
  "All",
  "Engine",
  "Brakes",
  "Suspension",
  "Electrical",
  "Interior",
  "Exterior",
  "Wheels & Tires",
  "Drivetrain",
  "Other",
];

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryFromUrl = searchParams.get("category") || "All";

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setParts(data);
      setLoading(false);
    };

    fetchParts();
  }, []);

  // 🔢 Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    parts.forEach((part) => {
      const cat = part.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    counts["All"] = parts.length;
    return counts;
  }, [parts]);

  // 🎯 Filter by URL category
  const filteredParts =
    categoryFromUrl === "All"
      ? parts
      : parts.filter(
          (part) => (part.category || "Other") === categoryFromUrl
        );

  const setCategory = (category: string) => {
    if (category === "All") {
      router.push("/browse");
    } else {
      router.push(`/browse?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Browse Parts</h1>

      {/* CATEGORY FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-8">
        {CATEGORIES.map((category) => {
          const isActive = categoryFromUrl === category;

          return (
            <button
              key={category}
              onClick={() => setCategory(category)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition
                ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
            >
              {category}{" "}
              <span className="opacity-70">
                ({categoryCounts[category] || 0})
              </span>
            </button>
          );
        })}
      </div>

      {/* PARTS GRID */}
      {loading ? (
        <p>Loading parts...</p>
      ) : filteredParts.length === 0 ? (
        <p>No parts found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredParts.map((part) => (
            <Link
              key={part.id}
              href={`/parts/${part.id}`}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center">
                {part.images?.[0] ? (
                  <img
                    src={part.images[0]}
                    alt={part.title}
                    className="h-full w-full object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>

              <h3 className="font-semibold">{part.title}</h3>

              {part.price !== null && (
                <p className="text-sm text-gray-600">${part.price}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
