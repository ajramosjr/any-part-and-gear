"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RequireAuth from "@/app/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";

export default function SubmitReviewPage() {
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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      part_id: partId,
      user_id: user.id,
      rating,
      comment,
    });

    setLoading(false);

    if (!error) {
      router.push(`/parts/${partId}`);
    } else {
      alert(error.message);
    }
  };

  return (
    <RequireAuth>
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Submit Review</h1>

        <form onSubmit={submitReview} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Rating</span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded p-2 mt-1"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 && "s"}
                </option>
              ))}
            </select>
          </label>

          <textarea
            placeholder="Write your review…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded p-2 min-h-[120px]"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      </main>
    </RequireAuth>
  );
}
