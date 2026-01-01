"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Part = {
  id: number;
  title: string;
  description: string | null;
};

export default function BrowsePage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParts() {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    }

    fetchParts();
  }, []);

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>Browse Parts</h1>

      {loading && <p>Loading parts...</p>}

      {!loading && parts.length === 0 && <p>No parts listed yet.</p>}

      {parts.map((part) => (
        <div
          key={part.id}
          style={{
            border: "1px solid #333",
            padding: 12,
            marginBottom: 12,
            borderRadius: 6,
          }}
        >
          <h3>{part.title}</h3>
          <p>{part.description || "No description provided"}</p>
        </div>
      ))}
    </main>
  );
}
