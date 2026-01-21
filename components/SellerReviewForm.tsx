"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SellerReviewForm({ sellerId }: { sellerId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("seller_reviews").upsert({
      seller_id: sellerId,
      reviewer_id: user.id,
      rating,
      comment,
    });

    setLoading(false);
    location.reload();
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Leave a Review</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        style={{ padding: 8 }}
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} ⭐
          </option>
        ))}
      </select>

      <textarea
        placeholder="Optional comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{
          width: "100%",
          marginTop: 10,
          padding: 10,
          minHeight: 80,
        }}
      />

      <button
        onClick={submit}
        disabled={loading}
        style={{
          marginTop: 10,
          background: "#2563eb",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
        }}
      >
        Submit Review
      </button>
    </div>
  );
}
