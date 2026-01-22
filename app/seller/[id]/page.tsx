"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getSellerLevel } from "@/lib/getSellerLevel";

type Review = {
  rating: number;
  comment: string | null;
  created_at: string;
};

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params.id as string;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [level, setLevel] = useState<"Gold" | "Silver" | "Bronze">("Bronze");
  const [loading, setLoading] = useState(true);

  const isVerified = level === "Gold";

  useEffect(() => {
    if (!sellerId) return;

    const loadSellerData = async () => {
      const { data } = await supabase
        .from("seller_reviews")
        .select("rating, comment, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      setReviews(data || []);

      const sellerLevel = await getSellerLevel(sellerId);
      setLevel(sellerLevel as "Gold" | "Silver" | "Bronze");

      setLoading(false);
    };

    loadSellerData();
  }, [sellerId]);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading seller…</p>;
  }

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>Seller Profile</h1>

      {/* Seller Status */}
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            fontWeight: 700,
            color:
              level === "Gold"
                ? "#d97706"
                : level === "Silver"
                ? "#64748b"
                : "#92400e",
          }}
        >
          {level} Seller
        </span>

        {isVerified && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#dcfce7",
              color: "#166534",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            ✔ Verified Seller
          </span>
        )}
      </div>

      {/* Reviews */}
      <h3 style={{ marginTop: 32 }}>Reviews</h3>

      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((r, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 10,
            marginBottom: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <strong>⭐ {r.rating}/5</strong>
          {r.comment && <p>{r.comment}</p>}
          <p style={{ fontSize: 12, color: "#666" }}>
            {new Date(r.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </main>
  );
}
