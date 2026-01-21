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

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      const { data } = await supabase
        .from("seller_reviews")
        .select("rating, comment, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      setReviews(data ?? []);
      setLoading(false);
    };

    loadReviews();
  }, [sellerId]);

  // Check if user can review
  useEffect(() => {
    if (!currentUserId || currentUserId === sellerId) return;

    hasMessaged(currentUserId, sellerId).then(setCanReview);
  }, [currentUserId, sellerId]);

  return (
    <main style={{ padding: 40, maxWidth: 700 }}>
      <h1>Seller Profile</h1>

      {currentUserId === sellerId && (
        <p style={{ color: "#64748b" }}>
          You can’t review yourself.
        </p>
      )}

      {currentUserId !== sellerId && !canReview && (
        <p style={{ color: "#64748b", marginTop: 12 }}>
          You must message this seller before leaving a review.
        </p>
      )}

      {currentUserId !== sellerId && canReview && (
        <ReviewForm sellerId={sellerId} />
      )}

      <h2 style={{ marginTop: 40 }}>Reviews</h2>

      {loading && <p>Loading reviews…</p>}

      {!loading && reviews.length === 0 && (
        <p>No reviews yet.</p>
      )}

      {reviews.map((r, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 12,
            marginTop: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
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

/* Simple inline review form */
function ReviewForm({ sellerId }: { sellerId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const submitReview = async () => {
    setMessage("");

    const { error } = await fetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({ sellerId, rating, comment }),
    });

    if (error) {
      setMessage("Failed to submit review");
    } else {
      setMessage("Review submitted!");
      setComment("");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Leave a Review</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Stars
          </option>
        ))}
      </select>

      <br /><br />

      <textarea
        placeholder="Your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ width: "100%", minHeight: 80 }}
      />

      <br /><br />

      <button onClick={submitReview}>Submit Review</button>

      {message && <p>{message}</p>}
    </div>
  );
}
