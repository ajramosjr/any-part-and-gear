"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  price: number;
  image: string | null;
  created_at: string;
};

export default function BrowsePage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("id, title, price, image, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchParts();
  }, []);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading parts…</p>;
  }

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 24 }}>Browse Parts</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        {parts.map((part) => (
          <Link
            key={part.id}
            href={`/parts/${part.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.15s ease",
              }}
            >
              {part.image ? (
                <img
                  src={part.image}
                  alt={part.title}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    height: 180,
                    background: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6b7280",
                  }}
                >
                  No Image
                </div>
              )}

              <div style={{ padding: 16 }}>
                <h3 style={{ marginBottom: 8 }}>{part.title}</h3>
                <p style={{ fontWeight: 600 }}>${part.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
