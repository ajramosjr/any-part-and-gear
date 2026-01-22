"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const partId = params.partId as string;

  const [part, setPart] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const { data: partData } = await supabase
        .from("parts")
        .select("*")
        .eq("id", partId)
        .single();

      if (!partData) {
        router.push("/");
        return;
      }

      setPart(partData);
      setLoading(false);
    };

    loadData();
  }, [partId, router]);

  const submitReview = async () => {
    if (!part || !user) return;

    setSubmitting(true);

    await fetch("/api/reviews", {
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

    router.push(`/parts/${partId}`);
  };

  if (loading) {
    return <p style={{ padding: 40 }}>Loading review form…</p>;
  }

  return (
    <main style={{ padding: 40, maxWidth: 600 }}>
      <h1>Leave a Review</h1>

      <p style={{ color: "#555" }}>
        Reviewing: <strong>{part.title}</strong>
      </p>

      <label style={{ display: "block", marginTop: 20 }}>
        Rating
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={{ display: "block", marginTop: 6 }}
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "block", marginTop: 20 }}>
        Comment
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          style={{ display: "block", width: "100%", marginTop: 6 }}
        />
      </label>

      <button
        onClick={submitReview}
        disabled={submitting}
        style={{
          marginTop: 24,
          padding: "12px 16px",
          background: "#0f172a",
          color: "#fff",
          borderRadius: 8,
          border: "none",
        }}
      >
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </main>
  );
}
