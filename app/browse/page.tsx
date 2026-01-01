"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchParts(query = "") {
    setLoading(true);

    let request = supabase
      .from("parts")
      .select("*")
      .order("created_at", { ascending: false });

    if (query) {
      request = request.ilike("title", `%${query}%`);
    }
    
if (category) {
  query = query.eq("category", category);
}
    const { data, error } = await request;

    if (!error && data) {
      setParts(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchParts();
  }, []);

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>Browse Parts</h1>
      <p>Search car, truck, and boat parts from sellers and junkyards.</p>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search parts..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          fetchParts(e.target.value);
        }}
        style={{
          width: "100%",
          padding: "12px",
          margin: "16px 0",
          fontSize: "16px",
        }}
      />

      {/* RESULTS */}
      {loading && <p>Loading...</p>}

      {!loading && parts.length === 0 && <p>No parts found.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {parts.map((part) => (
          <li
            key={part.id}
            style={{
              padding: "12px",
              borderBottom: "1px solid #333",
            }}
          >
            <strong>{part.title}</strong>
            <p className="text-sm text-gray-600">${part.price}</p>
            {part.description && <p>{part.description}</p>}
          </li>
        ))}
      </ul>
      {part.image_url && (
  <img
    src={part.image_url}
    alt={part.title}
 <input className="w-full max-w-xs rounded" />  
    <select onChange={(e) => setCategory(e.target.value)}>
  <option value="">All</option>
  <option value="engine">Engine</option>
  <option value="brakes">Brakes</option>
</select>  
)}
    </main>
  );
}
