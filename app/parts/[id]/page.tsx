"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();
const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/800x500?text=No+Image+Available";

export default function PartDetailPage() {
  const { id } = useParams();
  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPart = async () => {
      const { data } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .single();

      setPart(data);

      if (data?.images?.length > 0) {
        setActiveImage(data.images[0]);
      }

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

  const images =
    part.images && part.images.length > 0
      ? part.images
      : [PLACEHOLDER_IMAGE];

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
        {/* MAIN IMAGE */}
        <img
          src={activeImage || PLACEHOLDER_IMAGE}
          alt={part.title}
          style={{
            width: "100%",
            height: 360,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 16,
          }}
        />

        {/* THUMBNAILS */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {images.map((img: string, index: number) => (
            <img
              key={index}
              src={img}
              alt={`Image ${index + 1}`}
              onClick={() => setActiveImage(img)}
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 8,
                cursor: "pointer",
                border:
                  activeImage === img
                    ? "3px solid #8b5cf6"
                    : "2px solid #ddd",
              }}
            />
          ))}
        </div>

        {/* DETAILS */}
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
