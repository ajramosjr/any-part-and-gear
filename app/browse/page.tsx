"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: string;
  user_id: string; // ✅ ADD THIS
  title: string;
  description: string;
  category?: string | null;
  condition?: string | null;
  images?: string[] | null;
};

const [userId, setUserId] = useState<string | null>(null);
const PLACEHOLDER =
  "https://via.placeholder.com/600x400?text=No+Image";

export default function BrowsePage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [filtered, setFiltered] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [condition, setCondition] = useState("all");

  useEffect(() => {
    const fetchParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false });
    
      const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  setUserId(data.user?.id ?? null);
};

getUser();

      if (!error && data) {
        setParts(data);
        setFiltered(data);
      }
      setLoading(false);
    };

    fetchParts();
  }, []);

  useEffect(() => {
    let result = parts;

    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter(
        (p) => p.category === category
      );
    }

    if (condition !== "all") {
      result = result.filter(
        (p) => p.condition === condition
      );
    }

    setFiltered(result);
  }, [search, category, condition, parts]);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading…</p>;
  }

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ color: "#fff", marginBottom: 20 }}>
        Browse Parts
      </h1>

      {/* FILTER BAR */}
      <div style={filters}>
        <input
          placeholder="Search parts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={select}
        >
          <option value="all">All Categories</option>
          <option value="engine">Engine</option>
          <option value="exhaust">Exhaust</option>
          <option value="suspension">Suspension</option>
          <option value="interior">Interior</option>
          <option value="electronics">Electronics</option>
        </select>

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          style={select}
        >
          <option value="all">Any Condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">
            Refurbished
          </option>
        </select>
      </div>

      {/* GRID */}
      <div style={grid}>
        {filtered.map((part) => (
          <div key={part.id} style={card}>
            <img
              src={
                part.images && part.images.length > 0
                  ? part.images[0]
                  : PLACEHOLDER
              }
              style={image}
            />

            <a
  href={`/seller/${part.user_id}`}
  style={{ textDecoration: "none" }}
>
  <h3 style={title}>{part.title}</h3>
</a>
            <p style={desc}>{part.description}</p>

            <div style={tags}>
              {part.category && (
                <span style={tag}>
                  {part.category}
                </span>
              )}
              {part.condition && (
                <span style={tag}>
                  {part.condition}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

/* STYLES */

const filters = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap" as const,
  marginBottom: 30,
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "none",
  minWidth: 200,
};

const select = {
  padding: 10,
  borderRadius: 8,
  border: "none",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 24,
};

const card = {
  background: "#111",
  borderRadius: 14,
  padding: 16,
};

const image = {
  width: "100%",
  height: 180,
  objectFit: "cover" as const,
  borderRadius: 10,
};

const title = {
  color: "#fff",
  marginTop: 12,
};

const desc = {
  color: "#aaa",
  fontSize: 14,
};

const tags = {
  display: "flex",
  gap: 8,
  marginTop: 10,
};

const tag = {
  background: "#222",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 12,
};
