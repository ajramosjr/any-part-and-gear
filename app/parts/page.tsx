"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/supabaseClient";

type Part = {
  id: number; // ✅ MUST be number
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

  return (
    <div style={{ padding: 20 }}>
      <h1>Marketplace</h1>

      {/* CATEGORY FILTERS */}
      <div style={{ marginBottom: 12 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              marginRight: 6,
              marginBottom: 6,
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: activeCategory === cat ? "#000" : "#fff",
              color: activeCategory === cat ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TRADE ONLY */}
      <label style={{ display: "block", marginBottom: 16 }}>
        <input
          type="checkbox"
          checked={tradeOnly}
          onChange={() => setTradeOnly((v) => !v)}
        />{" "}
        Trade only
      </label>

      {loading && <p>Loading parts...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {parts.map((part) => {
          const mainImage = part.image_urls?.[0];

          return (
            <div
              key={part.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Link href={`/parts/${part.id}`}>
                <div style={{ cursor: "pointer" }}>
                  {mainImage && (
                    <img
                      src={mainImage}
                      alt={part.title}
                      style={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                        borderRadius: 6,
                        marginBottom: 8,
                      }}
                    />
                  )}

                  <h3 style={{ marginBottom: 4 }}>{part.title}</h3>
                  <p style={{ margin: 0 }}>${part.price}</p>

                  <small style={{ color: "#666" }}>
                    {part.platform} · {part.category}
                  </small>
                </div>
              </Link>

              {/* FAVORITE BUTTON */}
              <button
                onClick={() => toggleFavorite(part.id)}
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: 6,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  background: favorites.includes(part.id)
                    ? "#ffe6e6"
                    : "#f9f9f9",
                  cursor: "pointer",
                }}
              >
                {favorites.includes(part.id) ? "❤️ Saved" : "🤍 Save"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
