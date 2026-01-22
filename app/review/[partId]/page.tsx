"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SubmitReviewPage() {
  const { partId } = useParams();
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const submitReview = async () => {
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Get part seller
    const { data: part } = await supabase
      .from("parts")
      .select("user_id")
      .eq("id", partId)
      .single();

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sellerId: part.user_id,
        buyerId: user.id,
        partId,
        rating,
        comment,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error);
    } else {
      router.push(`/seller/${part.user_id}`);
    }
  };

  return (
    <main style={{ padding: 40, maxWidth: 500 }}>
      <h1>Leave a Review</h1>

      <label>Rating</label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n}>{n}</option>
        ))}
      </select>

      <br /><br />

      <textarea
        placeholder="Write your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ width: "100%", height: 120 }}
      />

      <br /><br />

      <button onClick={submitReview}>Submit Review</button>

      {error && (
        <p style={{ color: "red", marginTop: 12 }}>{error}</p>
      )}
    </main>
  );
}
