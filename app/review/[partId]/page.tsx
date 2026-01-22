"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SubmitReviewPage() {
  const params = useParams();
  const router = useRouter();
  const partId = params.partId as string;

  const [userId, setUserId] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      // Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);

      // Get purchase record (CONFIRMS buyer + completed sale)
      const { data: purchase } = await supabase
        .from("purchases")
        .select("buyer_id, seller_id")
        .eq("part_id", partId)
        .eq("buyer_id", user.id)
        .eq("status", "completed")
        .single();

      if (!purchase) {
        setError("You are not allowed to review this item.");
        setLoading(false);
        return;
      }

      // Prevent self-review
      if (purchase.buyer_id === purchase.seller_id) {
        setError("You cannot review yourself.");
        setLoading(false);
        return;
      }

      setSellerId(purchase.seller_id);

      // Prevent duplicate review
      const { data: existingReview } = await supabase
        .from("seller_reviews")
        .select("id")
        .eq("part_id", partId)
        .eq("buyer_id", user.id)
        .single();

      if (existingReview) {
        setError("You have already reviewed this purchase.");
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    loadData();
  }, [partId, router]);

  const submitReview = async () => {
    if (!sellerId || !userId) return;

    await supabase.from("seller_reviews").insert({
      seller_id: sellerId,
      buyer_id: userId,
      part_id: partId,
      rating,
      comment,
    });

    router.push(`/seller/${sellerId}`);
  };

  if (loading) {
    return <p style={{ padding: 40 }}>Checking eligibility…</p>;
  }

  if (error) {
    return (
      <p style={{ padding: 40, color: "red", fontWeight: 600 }}>
        {error}
      </p>
    );
  }

  return (
    <main style={{ padding: 40, maxWidth: 600 }}>
      <h1>Leave a Review</h1>

      {/* Rating */}
      <label style={{ display: "block", marginTop: 20 }}>
        Rating
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={{ display: "block", marginTop: 6 }}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} Star{n !== 1 && "s"}
            </option>
          ))}
        </select>
      </label>

      {/* Comment */}
      <label style={{ display: "block", marginTop: 20 }}>
        Comment (optional)
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          style={{ width: "100%", marginTop: 6 }}
        />
      </label>

      <button
        onClick={submitReview}
        style={{
          marginTop: 20,
          background: "#2563eb",
          color: "#fff",
          padding: "10px 18px",
          borderRadius: 8,
          fontWeight: 700,
        }}
      >
        Submit Review
      </button>
    </main>
  );
}
