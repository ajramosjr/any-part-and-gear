"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

      <div>
        {parts
          .filter((part) =>
            part.title?.toLowerCase().includes(search.toLowerCase())
          )
          .map((part) => (
            <Link href={`/browse/${part.id}`} key={part.id}>
              <div
                style={{
                  border: "1px solid #444",
                  padding: "16px",
                  marginBottom: "12px",
                  cursor: "pointer",
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
            </Link>
          ))}
      </div>
    </main>
  );
}
