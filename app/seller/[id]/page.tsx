"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getSellerStats } from "@/lib/getSellerStats";

type Review = {
  rating: number;
  comment: string;
  created_at: string;
};

export default function SellerPage() {
  const params = useParams();
  const sellerId = params.id as string;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    average: number | null;
    count: number;
    isTopSeller: boolean;
  } | null>(null);

  useEffect(() => {
    const loadSellerData = async () => {
      // Load reviews
      const { data, error } = await supabase
        .from("seller_reviews")
        .select("rating, comment, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews(data);
      }

      // Load seller stats (rating + badge)
      const sellerStats = await getSellerStats(sellerId);
      setStats(sellerStats);

      setLoading(false);
    };

    if (sellerId) {
      loadSellerData();
    }
  }, [sellerId]);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading seller profile…</p>;
  }

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>Seller Profile</h1>

      {/* ⭐ Seller Rating & Badge */}
      {stats && (
        <div style={{ marginTop: 12 }}>
          {stats.isTopSeller && (
            <span
              style={{
                background: "#facc15",
                color: "#78350f",
                padding: "6px 12px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 13,
                display: "inline-block",
                marginBottom: 6,
              }}
            >
              ⭐ Top Seller
            </span>
          )}

          {stats.average && (
            <p style={{ marginTop: 6, color: "#475569" }}>
              ⭐ {stats.average} ({stats.count} reviews)
            </p>
          )}
        </div>
      )}

      {/* Reviews */}
      <h2 style={{ marginTop: 30 }}>Reviews</h2>

      {reviews.length === 0 && (
        <p style={{ marginTop: 10 }}>No reviews yet.</p>
      )}

      {reviews.map((review, index) => (
        <div
          key={index}
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 12,
            marginTop: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ fontWeight: 700 }}>⭐ {review.rating}</p>
          <p style={{ marginTop: 6 }}>{review.comment}</p>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
            {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </main>
  );
}
