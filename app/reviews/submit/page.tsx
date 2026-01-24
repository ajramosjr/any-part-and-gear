"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function SubmitReviewPage() {
  const supabase = createClient();

  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in to submit a review.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      rating,
      comment,
    });

    if (error) {
      setMessage("Failed to submit review.");
    } else {
      setMessage("Review submitted successfully!");
      setRating(null);
      setComment("");
    }

    setLoading(false);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit a Review</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Rating</label>
          <select
            value={rating ?? ""}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded p-2"
            required
          >
            <option value="" disabled>
              Select rating
            </option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded p-2"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </main>
  );
}
