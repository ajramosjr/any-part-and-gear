"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: string;
  title: string;
  description: string;
};

export default function BrowsePage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("id, title, description")
        .order("id", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchParts();
  }, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading parts…</p>;
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        color: "#fff",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Browse Parts</h1>

      {parts.length === 0 && <p>No parts listed yet.</p>}

      {parts.map((part) => (
        <div
          key={part.id}
          style={{
            backgroundColor: "#111",
            border: "1px solid #222",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            {part.title}
          </h3>

          <p
            style={{
              fontSize: "14px",
              color: "#bbb",
            }}
          >
            {part.description}
          </p>
        </div>
      ))}
    </div>
  );
}
