"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const [parts, setParts] = useState<Part[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParts = async () => {
      const { data } = await supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setParts(data);
      setLoading(false);
    };

    fetchParts();
  }, []);

  const filteredParts =
    activeCategory === "All"
      ? parts
      : parts.filter(
          (part) =>
            (part.category || "Other") === activeCategory
        );

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Browse Parts</h1>

      {/* CATEGORY FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-8">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition
              ${
                activeCategory === category
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
          >
            {category}
          </button>
        ))}
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

              {part.price && (
                <p className="text-sm text-gray-600">
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
