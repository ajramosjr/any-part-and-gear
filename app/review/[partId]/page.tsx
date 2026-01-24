"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

export default function ReviewPage() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();

  const partId = Number(params.partId);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isNaN(partId)) {
      router.push("/");
    }
  }, [partId, router]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } else {
      alert(error.message);
    }
  };

  return (
    <RequireAuth>
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Leave a Review</h1>

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
                  {r}
                </option>
              ))}
            </select>
          </label>

          <textarea
            placeholder="Write your review…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full border rounded p-2"
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
