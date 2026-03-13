"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const partId = params.partId as string;

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

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
      <div className="max-w-xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-6">Leave a Review</h1>

        <form onSubmit={submitReview} className="space-y-4">
          <div>
            <label className="block mb-1">Rating</label>
            <select
              className="border p-2 w-full rounded"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r !== 1 && "s"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Comment</label>
            <textarea
              className="border p-2 w-full rounded"
              rows={4}
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </RequireAuth>
  );
}
