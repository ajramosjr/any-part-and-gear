"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RequireAuth from "@/app/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";

export default function SubmitReviewClient() {
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
    } = await supabase.auth.getUser();

    if (!user) {
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
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-6">Leave a Review</h1>

        <form onSubmit={submitReview} className="space-y-4">
          <select
            className="border p-2 w-full"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5,4,3,2,1].map((r)=>(
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>

          <textarea
            className="border p-2 w-full"
            rows={4}
            placeholder="Write your review..."
            value={comment}
            onChange={(e)=>setComment(e.target.value)}
          />

          <button
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </RequireAuth>
  );
}
