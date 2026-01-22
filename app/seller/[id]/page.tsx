"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getSellerRating } from "@/lib/getSellerRating";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

    const loadSeller = async () => {
      // Reviews
      const { data: reviewData } = await supabase
        .from("seller_reviews")
        .select("rating, comment, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      setReviews(reviewData || []);

      // ⭐ Average rating
      const avgRating = await getSellerRating(sellerId);
      setRating(avgRating);

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

      {/* ⭐ RATING */}
      <p style={{ marginTop: 8, fontSize: 18, fontWeight: 700 }}>
        ⭐ {rating > 0 ? rating : "No ratings yet"}
      </p>

      {/* REVIEWS */}
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
