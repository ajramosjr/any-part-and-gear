"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getSellerRating } from "@/lib/getSellerRating";
import { isVerifiedSeller } from "@/lib/isVerifiedSeller";

type Review = {
  rating: number;
  comment: string;
  created_at: string;
};

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params.id as string;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

    const loadSeller = async () => {
      const { data: reviewData } = await supabase
        .from("seller_reviews")
        .select("rating, comment, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      setReviews(reviewData || []);

      const avgRating = await getSellerRating(sellerId);
      setRating(avgRating);

      const isVerified = await isVerifiedSeller(sellerId);
      setVerified(isVerified);

      setLoading(false);
    };

    loadSeller();
  }, [sellerId]);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading seller…</p>;
  }

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>Seller Profile</h1>

      {/* ⭐ Rating */}
      <p style={{ marginTop: 6, fontSize: 18, fontWeight: 700 }}>
        ⭐ {rating > 0 ? rating : "No ratings yet"}
      </p>

      {/* ✅ Verified Badge */}
      {verified && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
            padding: "6px 12px",
            borderRadius: 999,
            background: "#ecfeff",
            color: "#0369a1",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          ✔ Verified Seller
        </div>
      )}

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
          <p>{r.comment}</p>
          <p style={{ fontSize: 12, color: "#666" }}>
            {new Date(r.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </main>
  );
}
