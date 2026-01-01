"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔹 Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch parts (with search)
  async function fetchParts() {
    setLoading(true);

    let query = supabase.from("parts").select("*");

    if (search.trim() !== "") {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (!error && data) {
      setParts(data);
    }

    setLoading(false);
  }

  // 🔹 Run when page loads + when search changes
  useEffect(() => {
    fetchParts();
  }, [search]);

  return (
    <main style={{ padding: "40px", maxWidth: "700px" }}>
      <h1>Browse Parts</h1>
      <p>Search car, truck, and boat parts from sellers.</p>

      {/* 🔍 SEARCH BAR */}
      <input
        type="text"
        placeholder="Search parts (ex: caliper)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />

      {loading && <p>Loading...</p>}

      {/* 📦 RESULTS */}
      {parts.length === 0 && !loading && <p>No parts found.</p>}

      {parts.map((part) => (
        <div
          key={part.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <h3>{part.title}</h3>
          <p>{part.description || "No description provided"}</p>
        </div>
      ))}
    </main>
  );
}
