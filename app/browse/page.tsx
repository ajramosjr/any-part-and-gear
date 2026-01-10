"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  images?: string[] | null;
};

export default function BrowsePage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data as Part[]);
      }

      setLoading(false);
    };

    fetchParts();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40, color: "#fff" }}>
        Loading parts...
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ color: "#fff", marginBottom: 30 }}>
        Browse Parts
      </h1>

      {parts.map((part) => (
        <div
          key={part.id}
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          {/* IMAGE (only if it exists) */}
          {part.images && part.images.length > 0 && (
            <img
              src={part.images[0]}
              alt={part.title}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 12,
                marginBottom: 16,
              }}
            />
          )}

          <h3
            style={{
              color: "#111",
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            {part.title}
          </h3>

          <p
            style={{
              color: "#444",
              marginBottom: 10,
            }}
          >
            {part.description}
          </p>

          <small style={{ color: "#666" }}>
            Listed on{" "}
            {new Date(part.created_at).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
}
