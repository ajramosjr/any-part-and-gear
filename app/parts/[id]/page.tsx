"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/800x500?text=No+Image+Available";

export default function PartDetailPage() {
  const { id } = useParams();
  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPart = async () => {
      const { data } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .single();

      setPart(data);
      setLoading(false);
    };

    fetchPart();
  }, [id]);

  if (loading) {
    return <p style={{ color: "#fff", padding: 40 }}>Loading…</p>;
  }

  if (!part) {
    return <p style={{ color: "#fff", padding: 40 }}>Part not found</p>;
  }

  const imageSrc =
    part.images && part.images.length > 0
      ? part.images[0]
      : PLACEHOLDER_IMAGE;

  return (
    <div style={{ padding: 40 }}>
      <Link href="/browse" style={{ color: "#8b5cf6" }}>
        ← Back to Browse
      </Link>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          marginTop: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <img
          src={imageSrc}
          alt={part.title}
          style={{
            width: "100%",
            height: 300,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 20,
          }}
        />

        <h1 style={{ color: "#111", marginBottom: 10 }}>
          {part.title}
        </h1>

        <p style={{ color: "#444", fontSize: 16 }}>
          {part.description}
        </p>

        <p style={{ color: "#666", marginTop: 12 }}>
          Listed on{" "}
          {new Date(part.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
