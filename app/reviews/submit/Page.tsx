"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/components/RequireAuth";

export default function SubmitReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const partId = searchParams.get("partId");
  const sellerId = searchParams.get("sellerId");

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitReview = async () => {
    setError("");

    if (!partId || !sellerId) {
      setError("Missing review information.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    // 🛑 Prevent self-review
    if (user.id === sellerId) {
      setError("You cannot review yourself.");
      setLoading(false);
      return;
    }

    // ⭐ Insert review
    const { error: reviewError } = await supabase
      .from("seller_reviews")
      .insert({
        seller_id: sellerId,
        buyer_id: user.id,
        part_id: partId,
        rating,
        comment,
      });

    if (reviewError) {
      setError(reviewError.message);
      setLoading(false);
      return;
    }

    // ✅ Mark review request as completed
    await supabase
      .from("review_requests")
      .update({ completed: true })
      .eq("part_id", partId)
      .eq("buyer_id", user.id);

    setLoading(false);
    router.push(`/seller/${sellerId}`);
  };

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 600 }}>
        <h1>Leave a Review</h1>

        <p style={{ marginTop: 8, color: "#555" }}>
          Rate your experience with this seller
        </p>

        {/* ⭐ Stars */}
        <div style={{ marginTop: 24 }}>
          <label style={{ fontWeight: 600 }}>Rating</label>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                style={{
                  fontSize: 26,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: star <= rating ? "#facc15" : "#d1d5db",
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* 💬 Comment */}
        <div style={{ marginTop: 24 }}>
          <label style={{ fontWeight: 600 }}>Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            placeholder="How was the transaction?"
            style={{
              width: "100%",
              marginTop: 8,
              padding: 12,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "red", marginTop: 12 }}>{error}</p>
        )}

        <button
          onClick={submitReview}
          disabled={loading}
          style={{
            marginTop: 24,
            padding: "12px 24px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </main>
    </RequireAuth>
  );
}
