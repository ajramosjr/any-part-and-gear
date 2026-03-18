"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Business = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  website: string | null;
  photo_url: string | null;
  specialties: string[];
  verified: boolean;
  owner_id: string | null;
};

type Review = {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: { username: string | null; full_name: string | null } | null;
};

function Stars({
  value,
  interactive = false,
  onChange,
}: {
  value: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
}) {
  return (
    <span className="inline-flex text-yellow-400 text-xl gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => interactive && onChange && onChange(s)}
          className={interactive ? "cursor-pointer hover:scale-110 transition" : "cursor-default"}
        >
          {s <= value ? "★" : "☆"}
        </button>
      ))}
    </span>
  );
}

export default function BusinessProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    const { data: biz } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", id)
      .single();

    const { data: revData } = await supabase
      .from("business_reviews")
      .select("id, user_id, rating, comment, created_at, profiles(username, full_name)")
      .eq("business_id", id)
      .order("created_at", { ascending: false });

    const { data: authData } = await supabase.auth.getUser();
    const uid = authData.user?.id ?? null;

    setBusiness(biz ?? null);
    setReviews((revData ?? []) as unknown as Review[]);
    setCurrentUserId(uid);
    setAlreadyReviewed(
      uid ? (revData ?? []).some((r: any) => r.user_id === uid) : false
    );
    setLoading(false);
  };

  useEffect(() => {
    if (id) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const submitReview = async () => {
    setFormError(null);
    if (!currentUserId) {
      router.push("/login");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("business_reviews").insert({
      business_id: id,
      user_id: currentUserId,
      rating,
      comment: comment.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setComment("");
    setRating(5);
    await loadData();
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading…</div>;
  }

  if (!business) {
    return (
      <div className="p-6">
        <p>Business not found.</p>
        <Link href="/business-hub" className="text-blue-600 hover:underline">
          ← Back to Business Hub
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* Back */}
      <Link
        href="/business-hub"
        className="text-blue-600 hover:underline text-sm mb-4 inline-block"
      >
        ← Back to Business Hub
      </Link>

      {/* Hero photo */}
      {business.photo_url ? (
        <img
          src={business.photo_url}
          alt={business.name}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-7xl mb-6">
          🔧
        </div>
      )}

      {/* Name + verified */}
      <div className="flex items-center gap-3 flex-wrap mb-1">
        <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
        {business.verified && (
          <span className="text-blue-600 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            ✔ Verified Business
          </span>
        )}
      </div>

      {/* Avg rating summary */}
      <div className="flex items-center gap-3 mb-4">
        <Stars value={Math.round(avgRating)} />
        <span className="text-gray-600 text-sm">
          {reviews.length > 0
            ? `${avgRating.toFixed(1)} out of 5 · ${reviews.length} review${
                reviews.length !== 1 ? "s" : ""
              }`
            : "No reviews yet"}
        </span>
      </div>

      {/* Info grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
        {(business.city || business.state || business.address) && (
          <div>
            <span className="font-semibold">📍 Address</span>
            <p className="mt-0.5">
              {[business.address, business.city, business.state]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}
        {business.phone && (
          <div>
            <span className="font-semibold">📞 Phone</span>
            <p className="mt-0.5">
              <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">
                {business.phone}
              </a>
            </p>
          </div>
        )}
        {business.website && (
          <div>
            <span className="font-semibold">🌐 Website</span>
            <p className="mt-0.5">
              <a
                href={
                  business.website.startsWith("http")
                    ? business.website
                    : `https://${business.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {business.website}
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      {business.description && (
        <p className="text-gray-700 mb-6 leading-relaxed">{business.description}</p>
      )}

      {/* Specialties */}
      {business.specialties.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">🔧 Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {business.specialties.map((s) => (
              <span
                key={s}
                className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          ⭐ Reviews{" "}
          {reviews.length > 0 && (
            <span className="text-gray-500 font-normal text-lg">
              ({reviews.length})
            </span>
          )}
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => {
              const name =
                r.profiles?.full_name || r.profiles?.username || "Anonymous";
              return (
                <div key={r.id} className="border rounded-xl p-4 bg-white">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="font-semibold text-gray-800">{name}</span>
                    <Stars value={r.rating} />
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="text-gray-700 text-sm mt-2">{r.comment}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Leave a review */}
      {currentUserId && !alreadyReviewed && (
        <div className="border rounded-xl p-6 bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Leave a Review</h2>

          {formError && (
            <p className="text-red-500 mb-3 text-sm">{formError}</p>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Your Rating</label>
            <Stars value={rating} interactive onChange={setRating} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm"
              rows={4}
              placeholder="Share your experience…"
            />
          </div>

          <button
            onClick={submitReview}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </div>
      )}

      {currentUserId && alreadyReviewed && (
        <p className="text-sm text-gray-500 italic">You have already reviewed this business.</p>
      )}

      {!currentUserId && (
        <p className="text-sm text-gray-500">
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>{" "}
          to leave a review.
        </p>
      )}
    </main>
  );
}
