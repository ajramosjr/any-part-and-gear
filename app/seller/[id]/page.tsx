"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Review = {
  rating: number;
  comment: string;
  created_at: string;
};

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params.id as string;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      /* ------------------ LOAD REVIEWS ------------------ */
      const { data: reviewData } = await supabase
        .from("seller_reviews")
        .select("rating, comment, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      setReviews(reviewData || []);

      /* -------- CHECK IF USER CAN REVIEW (COMPLETED SALE) -------- */
      if (user) {
        const { data: completedOrder } = await supabase
          .from("orders")
          .select("id")
          .eq("seller_id", sellerId)
          .eq("buyer_id", user.id)
          .eq("status", "completed")
          .maybeSingle();

        setCanReview(!!completedOrder);
      }

      setLoading(false);
    };

    loadData();
  }, [sellerId]);

  const submitReview = async () => {
    if (!comment) return alert("Please write a review");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("seller_reviews").insert({
      seller_id: sellerId,
      buyer_id: user.id,
      rating,
      comment,
    });

    setComment("");
    setRating(5);

    // refresh
    const { data } = await supabase
      .from("seller_reviews")
      .select("rating, comment, created_at")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });

    setReviews(data || []);
  };

  if (loading) {
    return <p style={{ padding: 40 }}>Loading seller…</p>;
  }

  return (
    <main style={{ padding: 40, maxWidth: 700 }}>
      <h1>Seller Profile</h1>

      {/* ⭐ Reviews */}
      <h2 style={{ marginTop: 30 }}>Reviews</h2>

      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((r, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <strong>⭐ {r.rating}</strong>
          <p>{r.comment}</p>
          <p style={{ fontSize: 12, color: "#64748b" }}>
            {new Date(r.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}

      {/* ✍️ Review Form (LOCKED) */}
      {canReview ? (
        <>
          <h3 style={{ marginTop: 30 }}>Leave a Review</h3>

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

          <br />
          <br />

          <textarea
            placeholder="Write your review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          />

          <br />
          <br />

          <button onClick={submitReview}>Submit Review</button>
        </>
      ) : (
        <p style={{ marginTop: 30, color: "#64748b" }}>
          Only buyers who completed a purchase can leave a review.
        </p>
      )}
    </main>
  );
}
