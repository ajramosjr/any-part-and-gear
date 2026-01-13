"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/800x500?text=No+Image+Available";

export default function PartDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const fetchPart = async () => {
      const { data } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .single();

      if (!mounted) return;

      setPart(data);

      if (data?.images?.length > 0) {
        setActiveImage(data.images[0]);
      }

      setLoading(false);
    };

    fetchPart();

    return () => {
      mounted = false;
    };
  }, [id, supabase]);

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
  if (!part) return <p style={{ padding: 40 }}>Part not found</p>;

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

        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {images.map((img: string, index: number) => (
            <img
              key={index}
              src={img}
              onClick={() => setActiveImage(img)}
              style={{
                width: 80,
                height: 80,
                cursor: "pointer",
                borderRadius: 8,
                border:
                  activeImage === img
                    ? "3px solid #8b5cf6"
                    : "2px solid #ddd",
              }}
            />
          ))}
        </div>

        <h1>{part.title}</h1>
        <p>{part.description}</p>

        {part.created_at && (
          <p style={{ color: "#666", marginTop: 12 }}>
            Listed on {new Date(part.created_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
