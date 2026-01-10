"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  images?: string[] | null;
};

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/600x400?text=No+Image+Available";

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
    return <p style={{ color: "#fff", padding: 40 }}>Loading parts…</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ color: "#fff", marginBottom: 30 }}>Browse Parts</h1>

      {parts.map((part) => {
        const imageSrc =
          part.images && part.images.length > 0
            ? part.images[0]
            : PLACEHOLDER_IMAGE;

        return (
          <Link
            key={part.id}
            href={`/parts/${part.id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                cursor: "pointer",
              }}
            >
              <img
                src={imageSrc}
                alt={part.title}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginBottom: 16,
                }}
              />

              <h3 style={{ color: "#111", marginBottom: 6 }}>
                {part.title}
              </h3>

              <p style={{ color: "#444" }}>{part.description}</p>

              <small style={{ color: "#666" }}>
                Listed on{" "}
                {new Date(part.created_at).toLocaleDateString()}
              </small>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
