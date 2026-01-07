"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Part = {
  id: number;
  title: string | null;
  category: string | null;
  price: number | null;
  image_url: string | null;
};

export default function BrowsePage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
const [minPrice, setMinPrice] = useState("");
const [maxPrice, setMaxPrice] = useState("");
  
  useEffect(() => {
    async function fetchParts() {
      let query = supabase.from("parts").select("*");

      if (search) {
        query = query.ilike("title", `%${search}%`);
      }

      if (category) {
        query = query.eq("category", category);
      }

      const { data } = await query.order("created_at", { ascending: false });
      setParts(data || []);
    }

    fetchParts();
  }, [search, category]);

  return (
    <main style={{ padding: 40 }}>
      <h1>Browse Parts</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search parts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 10, width: 300, marginBottom: 12, display: "block" }}
      />

      {/* CATEGORY FILTER */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: 10, width: 300, marginBottom: 24 }}
      >
        <option value="">All Categories</option>
        <option value="brakes">Brakes</option>
        <option value="suspension">Suspension</option>
        <option value="engine">Engine</option>
        <option value="interior">Interior</option>
        <option value="wheels">Wheels</option>
      </select>
{/* PRICE FILTER */}
<div style={{ marginBottom: 24 }}>
  <input
    type="number"
    placeholder="Min price"
    value={minPrice}
    onChange={(e) => setMinPrice(e.target.value)}
    style={{ padding: 10, width: 140, marginRight: 8 }}
  />

  <input
    type="number"
    placeholder="Max price"
    value={maxPrice}
    onChange={(e) => setMaxPrice(e.target.value)}
    style={{ padding: 10, width: 140 }}
  />
</div>
      {/* RESULTS */}
      {parts.length === 0 && <p>No parts found.</p>}

      {parts.map((part) => (
        <Link key={part.id} href={`/browse/${part.id}`}>
          <div
            style={{
              border: "1px solid #444",
              padding: 16,
              marginBottom: 12,
              cursor: "pointer",
            }}
          >
            <h3>{part.title}</h3>
            {part.category && <p>Category: {part.category}</p>}
            {part.price && <strong>${part.price}</strong>}
            {part.image_url && (
              <img
                src={part.image_url}
                alt={part.title ?? ""}
                style={{ maxWidth: 200, display: "block", marginTop: 8 }}
              />
            )}
          </div>
        </Link>
      ))}
    </main>
  );
}
