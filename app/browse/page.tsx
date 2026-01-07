"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    async function fetchParts() {
      let query = supabase.from("parts").select("*");

      if (search) {
        query = query.ilike("title", `%${search}%`);
      }

      if (category) {
        query = query.eq("category", category);
      }

      if (minPrice) {
        query = query.gte("price", Number(minPrice));
      }

      if (maxPrice) {
        query = query.lte("price", Number(maxPrice));
      }

      if (sort === "newest") {
        query = query.order("created_at", { ascending: false });
      }

      if (sort === "price_low") {
        query = query.order("price", { ascending: true });
      }

      if (sort === "price_high") {
        query = query.order("price", { ascending: false });
      }

      const { data } = await query;
      setParts(data || []);
    }

    fetchParts();
  }, [search, category, minPrice, maxPrice, sort]);

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

      {/* CATEGORY */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: 10, width: 300, marginBottom: 12 }}
      >
        <option value="">All Categories</option>
        <option value="brakes">Brakes</option>
        <option value="suspension">Suspension</option>
        <option value="engine">Engine</option>
        <option value="interior">Interior</option>
        <option value="wheels">Wheels</option>
      </select>

      {/* PRICE FILTER */}
      <div style={{ marginBottom: 12 }}>
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

      {/* SORT */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        style={{ padding: 10, width: 300, marginBottom: 24 }}
      >
        <option value="newest">Newest</option>
        <option value="price_low">Price: Low → High</option>
        <option value="price_high">Price: High → Low</option>
      </select>

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

      {/* PAGINATION (placeholder) */}
      <div style={{ marginTop: 24 }}>
        <button disabled>Prev</button>
        <button style={{ marginLeft: 12 }}>Next</button>
      </div>
    </main>
  );
}
