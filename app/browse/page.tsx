"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BrowsePage() {
  const [parts, setParts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchParts() {
      const { data } = await supabase.from("parts").select("*");
      setParts(data || []);
    }
    fetchParts();
  }, []);

  return (
    <main style={{ padding: "40px" }}>
      <h1>Browse Parts</h1>

      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search parts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "300px",
          display: "block",
        }}
      />

      {/* PART LIST */}
      <div>
        {parts
          .filter((part) =>
            part.title?.toLowerCase().includes(search.toLowerCase())
          )
          .map((part) => (
            <div
              key={part.id}
              style={{
                border: "1px solid #444",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
             <h3>{part.title}</h3>

{part.price !== null && (
  <p style={{ color: "#4ade80", marginTop: "4px" }}>
    ${Number(part.price).toFixed(2)}
  </p>
)}

{part.image_url && (
  <img
    src={part.image_url}
    alt={part.title}
    style={{ maxWidth: "200px", marginTop: "8px" }}
  />
)} 
            </div>
          ))}
      </div>
    </main>
  );
}
