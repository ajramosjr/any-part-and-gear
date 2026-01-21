"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { hasMessaged } from "@/lib/hasMessaged";

type Review = {
  rating: number;
  comment: string;
  created_at: string;
};

export default function SellerPage() {
  const params = useParams();
  const sellerId = params.id as string;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);

  // 🔹 Load logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  // 🔹 Load seller reviews
  useEffect(() => {
    const loadReviews = async () => {
      const { data, error } = await supabase
        .from("seller_reviews")
        .select("rating, comment, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews(data);
      }

      setLoading(false);
    };

    loadReviews();
  }, [sellerId]);

  return (
    <main style={{ padding: 40, maxWidth: 700 }}>
      <h1>Seller Profile</h1>

      {/* 🚫 Self-review guard */}
      {currentUserId === sellerId && (
        <p style={{ marginTop: 12, color: "#64748b" }}>
          You can’t review yourself.
        </p>
      )}

      {loading && <p>Loading reviews…</p>}

      {!loading && reviews.length === 0 && (
        <p style={{ marginTop: 12 }}>No reviews yet.</p>
      )}

      {reviews.map((review, index) => (
        <div
          key={index}
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ fontWeight: 600 }}>⭐ {review.rating}</p>
          <p>{review.comment}</p>
          <p style={{ fontSize: 12, color: "#666" }}>
            {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </main>
  );
}
