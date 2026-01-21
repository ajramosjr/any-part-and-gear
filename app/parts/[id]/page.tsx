"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getSellerRating } from "@/lib/getSellerRating";

type Part = {
  id: string;
  title: string;
  description: string;
  price: number;
  user_id: string;
};

export default function PartPage() {
  const params = useParams();
  const partId = params.id as string;

  const [part, setPart] = useState<Part | null>(null);
  const [sellerRating, setSellerRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", partId)
        .single();

      if (!error && data) {
        setPart(data);

        // 🔹 Load seller rating AFTER part exists
        const rating = await getSellerRating(data.user_id);
        setSellerRating(rating);
      }

      setLoading(false);
    };

    loadPart();
  }, [partId]);

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
  if (!part) return <p style={{ padding: 40 }}>Part not found</p>;

  return (
    <main style={{ padding: 40, maxWidth: 700 }}>
      <h1>{part.title}</h1>

      <p style={{ marginTop: 12 }}>{part.description}</p>

      <p style={{ marginTop: 12, fontWeight: 600 }}>
        Price: ${part.price}
      </p>

      {/* ✅ Seller section with rating */}
      <p style={{ marginTop: 6 }}>
        Seller:{" "}
        <Link
          href={`/seller/${part.user_id}`}
          style={{ color: "#2563eb", fontWeight: 600 }}
        >
          View profile
        </Link>

        {sellerRating && (
          <span
            style={{
              marginLeft: 8,
              color: "#f59e0b",
              fontWeight: 600,
            }}
          >
            ⭐ {sellerRating}
          </span>
        )}
      </p>
    </main>
  );
}
