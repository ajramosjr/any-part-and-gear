"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const SPECIALTIES = [
  "All",
  "Engine & Drivetrain",
  "Body & Paint",
  "Electrical",
  "Suspension & Brakes",
  "Tires & Wheels",
  "Transmission",
  "Marine / Boats",
  "RC Vehicles",
  "General Auto",
  "Tools & Equipment",
];

type Business = {
  id: string;
  name: string;
  description: string | null;
  city: string | null;
  state: string | null;
  photo_url: string | null;
  specialties: string[];
  verified: boolean;
  avg_rating: number;
  review_count: number;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-sm">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s}>{s <= Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export default function BusinessHubPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Fetch businesses with review aggregates via a join
      const { data, error } = await supabase
        .from("businesses")
        .select(
          "id, name, description, city, state, photo_url, specialties, verified, business_reviews(rating)"
        )
        .order("created_at", { ascending: false });

      if (!error && data) {
        const enriched: Business[] = data.map((b: any) => {
          const reviews: { rating: number }[] = b.business_reviews ?? [];
          const avg_rating =
            reviews.length > 0
              ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
                reviews.length
              : 0;
          return {
            id: b.id,
            name: b.name,
            description: b.description,
            city: b.city,
            state: b.state,
            photo_url: b.photo_url,
            specialties: b.specialties ?? [],
            verified: b.verified,
            avg_rating,
            review_count: reviews.length,
          };
        });
        setBusinesses(enriched);
      }

      setLoading(false);
    };

    load();
  }, []);

  const filtered = businesses.filter((b) => {
    const matchesSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.city ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (b.state ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesSpecialty =
      specialty === "All" || b.specialties.includes(specialty);

    return matchesSearch && matchesSpecialty;
  });

  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-blue-900">
            🔧 A.P.G Business Hub
          </h1>
          <p className="text-gray-500 mt-1">
            Discover local mechanics, shops, and part specialists near you.
          </p>
        </div>
        <Link
          href="/business-hub/new"
          className="bg-yellow-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          + List Your Business
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by name, city, or state…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 min-w-[220px]"
        />
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white"
        >
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-gray-500">Loading businesses…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl">No businesses found.</p>
          <p className="mt-2">
            Be the first to{" "}
            <Link href="/business-hub/new" className="text-blue-600 hover:underline">
              list yours
            </Link>
            !
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <Link
              key={b.id}
              href={`/business-hub/${b.id}`}
              className="border rounded-xl bg-white hover:shadow-lg transition overflow-hidden"
            >
              {/* Photo */}
              {b.photo_url ? (
                <img
                  src={b.photo_url}
                  alt={b.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-5xl">
                  🔧
                </div>
              )}

              <div className="p-4">
                {/* Name + verified */}
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-lg text-gray-900 truncate">
                    {b.name}
                  </h2>
                  {b.verified && (
                    <span
                      title="Verified Business"
                      className="text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200"
                    >
                      ✔ Verified
                    </span>
                  )}
                </div>

                {/* Location */}
                {(b.city || b.state) && (
                  <p className="text-gray-500 text-sm mb-2">
                    📍 {[b.city, b.state].filter(Boolean).join(", ")}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={b.avg_rating} />
                  <span className="text-sm text-gray-500">
                    {b.review_count > 0
                      ? `${b.avg_rating.toFixed(1)} (${b.review_count} review${
                          b.review_count !== 1 ? "s" : ""
                        })`
                      : "No reviews yet"}
                  </span>
                </div>

                {/* Specialties */}
                {b.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {b.specialties.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                    {b.specialties.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{b.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
