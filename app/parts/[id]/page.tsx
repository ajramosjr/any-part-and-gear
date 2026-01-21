"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/800x500?text=No+Image+Available";

type Part = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  image: string | null;
  user_id: string;
  created_at: string;
};

export default function PartDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setPart(data);
      }

      setLoading(false);
    };

    fetchPart();
  }, [id]);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading…</p>;
  }

  if (!part) {
    return <p style={{ padding: 40 }}>Part not found</p>;
  }

  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <Link href="/browse" style={{ color: "#2563eb" }}>
        ← Back to Browse
      </Link>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          marginTop: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <img
          src={part.image || PLACEHOLDER_IMAGE}
          alt={part.title}
          style={{
            width: "100%",
            height: 360,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 16,
          }}
        />

        <h1 style={{ fontSize: 28 }}>{part.title}</h1>

        {/* ✅ SELLER PROFILE LINK */}
        <p style={{ marginTop: 6 }}>
          Seller:{" "}
          <Link
            href={`/seller/${part.user_id}`}
            style={{ color: "#2563eb", fontWeight: 600 }}
          >
            View profile
          </Link>
        </p>

        {part.price && (
          <p
            style={{
              marginTop: 12,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            ${part.price}
          </p>
        )}

        {part.description && (
          <p style={{ marginTop: 16 }}>{part.description}</p>
        )}

        <p style={{ color: "#6b7280", marginTop: 16 }}>
          Listed on{" "}
          {new Date(part.created_at).toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}
