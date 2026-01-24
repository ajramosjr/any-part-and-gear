"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabaseBrowser";
import RequireAuth from "@/components/RequireAuth";

export default function SubmitReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const partId = searchParams.get("part");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!partId) {
      setError("Missing part ID.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.from("reviews").insert({
      part_id: partId,
      rating,
      comment,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(`/parts/${partId}`);
  }

  return (
    <RequireAuth>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Leave a Review</h1>

        {error && (
          <p className="mb-3 text-sm text-red-500">{error}</p>
        )}

        <label className="block mb-2 font-medium">Rating</label>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Comment</label>
        <textarea
          className="w-full mb-4 p-2 border rounded"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </RequireAuth>
  );
}
