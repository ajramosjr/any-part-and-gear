"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getSellerStats } from "@/lib/getSellerStats";

type Part = {
  id: number;
  title: string;
  description: string;
  price: number;
  user_id: string;
};

export default function PartPage() {
  const params = useParams();
  const partId = params.id as string;

  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerStats, setSellerStats] = useState<{
    average: number | null;
    count: number;
    isTopSeller: boolean;
  } | null>(null);

  useEffect(() => {
    const loadPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", partId)
        .single();

      if (!error && data) {
        setPart(data);

        // load seller stats
        const stats = await getSellerStats(data.user_id);
        setSellerStats(stats);
      }

      setLoading(false);
    };

    if (partId) {
      loadPart();
    }
  }, [partId]);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading part…</p>;
  }

  if (!part) {
    return <p style={{ padding: 40 }}>Part not found.</p>;
  }

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>{part.title}</h1>

      {/* Seller Info */}
      <p style={{ marginTop: 6 }}>
        Seller:{" "}
        <Link
          href={`/seller/${part.user_id}`}
          style={{ color: "#2563eb", fontWeight: 600 }}
        >
          View profile
        </Link>
      </p>

      {/* ⭐ Seller Rating + Badge */}
      {sellerStats && (
        <div style={{ marginTop: 8 }}>
          {sellerStats.isTopSeller && (
            <span
              style={{
                background: "#facc15",
                color: "#78350f",
                padding: "6px 12px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 13,
                marginRight: 10,
              }}
            >
              ⭐ Top Seller
            </span>
          )}

          {sellerStats.average && (
            <span style={{ color: "#475569", fontSize: 14 }}>
              ⭐ {sellerStats.average} ({sellerStats.count} reviews)
            </span>
          )}
        </div>
      )}

      {/* Description */}
      <p style={{ marginTop: 20 }}>{part.description}</p>

      {/* Price */}
      <p
        style={{
          marginTop: 20,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        ${part.price}
      </p>
    </main>
  );
}
