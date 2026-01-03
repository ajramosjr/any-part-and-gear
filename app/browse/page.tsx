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
        className="w-full max-w-xs rounded border p-2 mb-4"
        placeholder="Search parts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
              {part.image_url && (
                <img
                  src={part.image_url}
                  alt={part.title}
                  style={{ maxWidth: "200px" }}
                />
              )}
            </div>
          ))}
      </div>
    </main>
  );
}
