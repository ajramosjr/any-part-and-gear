"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  description: string;
  images: string[] | null;
  created_at: string;
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
        setParts(data);
      }

      setLoading(false);
    };

    fetchParts();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading parts...</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Browse Parts</h1>

      {parts.map((part) => (
        <div
          key={part.id}
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            maxWidth: 600,
          }}
        >
          {part.images && part.images.length > 0 && (
            <img
              src={part.images[0]}
              alt={part.title}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 12,
              }}
            />
          )}

          <h3>{part.title}</h3>
          <p>{part.description}</p>

          <small>
            Listed on {new Date(part.created_at).toLocaleDateString()}
          </small>
        </div>
      ))}
    </main>
  );
}
