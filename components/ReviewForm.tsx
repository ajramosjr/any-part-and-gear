"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ReviewForm({
  sellerId,
  partId,
}: {
  sellerId: string;
  partId: string;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submitReview = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("seller_reviews").insert({
      seller_id: sellerId,
      buyer_id: user.id,
      part_id: partId,
      rating,
      comment,
    });

    setDone(true);
    setLoading(false);
  };

  if (done) {
    return <p>✅ Review submitted. Thank you!</p>;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Leave a review</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} Stars
          </option>
        ))}
      </select>

      <textarea
        placeholder="Optional comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ width: "100%", marginTop: 12 }}
      />

      <button onClick={submitReview} disabled={loading}>
        Submit Review
      </button>
    </div>
  );
}
