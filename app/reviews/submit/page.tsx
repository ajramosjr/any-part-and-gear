"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RequireAuth from "@/app/components/RequireAuth";
import { createClient } from "@/lib/supabaseClient";

export default function SubmitReviewPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const partId = searchParams.get("partId");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partId) return;

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setLoading(false);

    const { error } = await supabase.from("reviews").insert({
      part_id: partId,
      user_id: user.id,
      rating,
      comment,
    });

    setLoading(false);

    if (!error) router.push(`/parts/${partId}`);
    else alert(error.message);
  };

  return (
    <RequireAuth>
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Submit Review</h1>

        <form onSubmit={submitReview} className="space-y-4">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded p-2"
          >
            {[5,4,3,2,1].map(r => (
              <option key={r} value={r}>{r} Star{r > 1 && "s"}</option>
            ))}
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded p-2"
            required
          />

          <button disabled={loading}>
            {loading ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      </main>
    </RequireAuth>
  );
}
