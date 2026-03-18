"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Car, Ship, Wrench, Gamepad2, MapPin, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// ─── Data model ───────────────────────────────────────────────────────────────

type Subcategory = {
  slug: string;
  label: string;
  specialties: string[];
};

type Group = {
  slug: string;
  label: string;
  Icon: React.ElementType;
  color: string; // Tailwind active bg color
  subcategories: Subcategory[];
};

const GROUPS: Group[] = [
  {
    slug: "automotive",
    label: "Automotive",
    Icon: Car,
    color: "bg-blue-600",
    subcategories: [
      { slug: "mechanics",    label: "Mechanics",          specialties: ["Engine & Drivetrain","General Auto","Transmission","Suspension & Brakes","Electrical","Mechanic"] },
      { slug: "body-shop",    label: "Collision & Body",   specialties: ["Body & Paint","Body Shop","Collision"] },
      { slug: "detailing",    label: "Detailing",          specialties: ["Detailing","Car Detailing"] },
      { slug: "performance",  label: "Performance & Tuning", specialties: ["Performance","Tuning","Performance / Tuning"] },
      { slug: "tires",        label: "Tire Shops",         specialties: ["Tires & Wheels","Tires","Tire Shop"] },
      { slug: "auto-parts",   label: "Auto Parts Stores",  specialties: ["Auto Parts","Parts Store"] },
    ],
  },
  {
    slug: "marine",
    label: "Marine & Powersports",
    Icon: Ship,
    color: "bg-cyan-600",
    subcategories: [
      { slug: "marine-repair", label: "Marine Services",     specialties: ["Marine / Boats","Marine","Boats","Marine Repair"] },
      { slug: "boat-parts",    label: "Boat Parts",          specialties: ["Boat Parts","Marine Parts"] },
      { slug: "atv",           label: "ATV / Dirt Bike",     specialties: ["ATV","Dirt Bike","Powersports","Jet Ski Services","ATV / Dirt Bike Shops"] },
    ],
  },
  {
    slug: "services",
    label: "Services",
    Icon: Wrench,
    color: "bg-orange-600",
    subcategories: [
      { slug: "tools",       label: "Tool Shops",            specialties: ["Tool Shop","Tools"] },
      { slug: "fabrication", label: "Fabrication & Welding", specialties: ["Fabrication","Welding","Fabrication Shops"] },
      { slug: "small-engine",label: "Small Engine Repair",   specialties: ["Small Engine","Small Engine Repair"] },
      { slug: "equipment",   label: "Equipment Rental",      specialties: ["Equipment Rental"] },
    ],
  },
  {
    slug: "rc",
    label: "RC & Hobby",
    Icon: Gamepad2,
    color: "bg-red-600",
    subcategories: [
      { slug: "rc-shops", label: "RC & Hobby Shops", specialties: ["RC Vehicles","RC Shop","RC & Hobby"] },
    ],
  },
  {
    slug: "local",
    label: "Local",
    Icon: MapPin,
    color: "bg-green-600",
    subcategories: [
      { slug: "bakeries", label: "Bakeries",     specialties: ["Bakery","Bakeries"] },
      { slug: "retail",   label: "Retail Shops", specialties: ["Retail","Retail Shop"] },
    ],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type SortMode = "popular" | "top-rated" | "newest";

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
  created_at: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-sm" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} aria-hidden="true">{s <= Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

export default function BusinessesPage() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-500">Loading…</p>}>
      <BusinessesContent />
    </Suspense>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function BusinessesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupParam = searchParams.get("group") ?? null;
  const subParam   = searchParams.get("sub")   ?? null;

  const [businesses, setBusinesses]   = useState<Business[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [sortMode, setSortMode]       = useState<SortMode>("newest");

  // ── Load businesses ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("businesses")
        .select(
          "id, name, description, city, state, photo_url, specialties, verified, created_at, business_reviews(rating)"
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
            created_at: b.created_at,
          };
        });
        setBusinesses(enriched);
      }
      setLoading(false);
    };
    load();
  }, []);

  // ── Active selections ────────────────────────────────────────────────────────
  const activeGroup = GROUPS.find((g) => g.slug === groupParam) ?? null;
  const activeSub   = activeGroup?.subcategories.find((s) => s.slug === subParam) ?? null;

  // ── Filter ───────────────────────────────────────────────────────────────────
  const filtered = businesses.filter((b) => {
    const matchesSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.city ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (b.state ?? "").toLowerCase().includes(search.toLowerCase());

    // If a specific sub-category is selected, match its specialties
    if (activeSub) {
      return matchesSearch && b.specialties.some((s) => activeSub.specialties.includes(s));
    }

    // If only a group is selected, match any specialty in any of its subcategories
    if (activeGroup) {
      const groupSpecialties = activeGroup.subcategories.flatMap((sc) => sc.specialties);
      return matchesSearch && b.specialties.some((s) => groupSpecialties.includes(s));
    }

    return matchesSearch;
  });

  // ── Sort ─────────────────────────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === "top-rated") return b.avg_rating - a.avg_rating;
    if (sortMode === "popular")   return b.review_count - a.review_count;
    // newest
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // ── Navigation helpers ───────────────────────────────────────────────────────
  const setGroup = (slug: string) => {
    if (groupParam === slug) {
      router.push("/businesses");
    } else {
      router.push(`/businesses?group=${slug}`);
    }
  };

  const setSub = (groupSlug: string, subSlug: string) => {
    if (subParam === subSlug) {
      router.push(`/businesses?group=${groupSlug}`);
    } else {
      router.push(`/businesses?group=${groupSlug}&sub=${subSlug}`);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-2">
            <Wrench className="w-9 h-9 text-blue-600" strokeWidth={2} />
            A.P.G Businesses
          </h1>
          <p className="text-gray-500 mt-1">
            Discover local mechanics, shops, and specialists near you.
          </p>
        </div>
        <Link
          href="/business-hub/new"
          className="bg-yellow-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          + List Your Business
        </Link>
      </div>

      {/* ── Main category groups ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-4">
        {GROUPS.map(({ slug, label, Icon, color }) => {
          const isActive = groupParam === slug;
          return (
            <button
              key={slug}
              onClick={() => setGroup(slug)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition
                ${isActive
                  ? `${color} text-white border-transparent shadow-md`
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                }`}
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Subcategory row (shown when a group is active) ───────────────────── */}
      {activeGroup && (
        <div className="flex flex-wrap gap-2 mb-5 pl-1">
          <ChevronRight className="w-4 h-4 text-gray-400 self-center" />
          {activeGroup.subcategories.map((sub) => {
            const isActive = subParam === sub.slug;
            return (
              <button
                key={sub.slug}
                onClick={() => setSub(activeGroup.slug, sub.slug)}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition
                  ${isActive
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-500 hover:text-gray-800"
                  }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Sort tabs + Search ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Sort tabs */}
        <div className="flex gap-2">
          {(
            [
              { mode: "popular",   icon: "🔥", label: "Popular Near You" },
              { mode: "top-rated", icon: "⭐", label: "Top Rated"        },
              { mode: "newest",    icon: "🆕", label: "Newly Added"      },
            ] as { mode: SortMode; icon: string; label: string }[]
          ).map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition
                ${sortMode === mode
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, city, or state…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm w-full max-w-xs"
        />
      </div>

      {/* ── Active filter breadcrumb ────────────────────────────────────────── */}
      {(activeGroup || activeSub) && (
        <p className="mb-4 text-sm text-blue-700 font-medium flex items-center gap-1">
          <span>Showing:</span>
          {activeGroup && <span>{activeGroup.label}</span>}
          {activeSub && (
            <>
              <ChevronRight className="w-3 h-3 text-blue-400" />
              <span>{activeSub.label}</span>
            </>
          )}
          <button
            onClick={() => router.push("/businesses")}
            className="ml-2 text-gray-400 hover:text-gray-600 underline text-xs"
          >
            Clear
          </button>
        </p>
      )}

      {/* ── Business grid ───────────────────────────────────────────────────── */}
      {loading ? (
        <p className="text-gray-500">Loading businesses…</p>
      ) : sorted.length === 0 ? (
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
          {sorted.map((b) => (
            <Link
              key={b.id}
              href={`/business-hub/${b.id}`}
              className="border rounded-xl bg-white hover:shadow-lg transition overflow-hidden group"
            >
              {/* Photo */}
              {b.photo_url ? (
                <img
                  src={b.photo_url}
                  alt={b.name}
                  className="w-full h-40 object-cover group-hover:brightness-95 transition"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <Wrench className="w-14 h-14 text-blue-400" strokeWidth={1.5} />
                </div>
              )}

              <div className="p-4">
                {/* Name + badges */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="font-bold text-lg text-gray-900 truncate">
                    {b.name}
                  </h2>
                  {b.verified && (
                    <span className="text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 whitespace-nowrap">
                      ✔ Verified
                    </span>
                  )}
                  {b.avg_rating >= 4.5 && b.review_count >= 3 && (
                    <span className="text-yellow-600 text-xs font-semibold bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200 whitespace-nowrap">
                      ⭐ Top Rated
                    </span>
                  )}
                </div>

                {/* Location */}
                {(b.city || b.state) && (
                  <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
                    {[b.city, b.state].filter(Boolean).join(", ")}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={b.avg_rating} />
                  <span className="text-sm text-gray-500">
                    {b.review_count > 0
                      ? `${b.avg_rating.toFixed(1)} (${b.review_count} review${b.review_count !== 1 ? "s" : ""})`
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

