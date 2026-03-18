"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/lib/getProfile";

type Part = {
  id: number;
  title: string;
  price: number | null;
};

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(value);
        return (
          <svg
            key={i}
            className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
          </svg>
        );
      })}
    </span>
  );
}

function InteractiveStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <span className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
          aria-label={`${star} star`}
        >
          <svg
            className={`w-7 h-7 transition-colors ${
              star <= (hovered || value) ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
          </svg>
        </button>
      ))}
    </span>
  );
}

export default function UserProfile() {
  const params = useParams<{ id: string }>();
  const userId = params.id;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // current viewer
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const loadData = async () => {
    const [
      { data: profileData },
      { data: partsData },
      { data: reviewsData },
      { data: { user } },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, website, created_at, updated_at")
        .eq("id", userId)
        .single(),
      supabase.from("parts").select("id,title,price").eq("user_id", userId),
      supabase
        .from("seller_reviews")
        .select(
          "id, rating, comment, created_at, reviewer:reviewer_id(id, username, full_name, avatar_url)"
        )
        .eq("seller_id", userId)
        .order("created_at", { ascending: false }),
      supabase.auth.getUser(),
    ]);

    setProfile(profileData ?? null);
    setParts(partsData ?? []);

    const reviewList: Review[] = (reviewsData ?? []).map((r: any) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      reviewer: Array.isArray(r.reviewer) ? r.reviewer[0] ?? null : r.reviewer,
    }));
    setReviews(reviewList);

    if (reviewList.length > 0) {
      const avg =
        reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length;
      setAvgRating(Math.round(avg * 10) / 10);
    }

    const vid = user?.id ?? null;
    setViewerId(vid);
    if (vid) {
      setAlreadyReviewed(reviewList.some((r) => r.reviewer?.id === vid));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewerId) return;

    setReviewLoading(true);
    setReviewError(null);

    const { error } = await supabase.from("seller_reviews").insert({
      seller_id: userId,
      reviewer_id: viewerId,
      rating: reviewRating,
      comment: reviewComment || null,
    });

    setReviewLoading(false);

    if (error) {
      setReviewError(error.message);
      return;
    }

    setReviewSuccess(true);
    setReviewComment("");
    setReviewRating(5);
    await loadData();
  };

  const displayName =
    profile?.full_name || profile?.username || "User";

  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  if (loading) {
    return <div className="p-8 text-gray-400">Loading…</div>;
  }

  if (!profile) {
    return <div className="p-8 text-gray-500">User not found.</div>;
  }

  const isOwner = viewerId === userId;
  const canReview = viewerId && !isOwner && !alreadyReviewed;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* ── Profile card ── */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={displayName}
              width={96}
              height={96}
              className="rounded-full object-cover border-2 border-blue-200 w-24 h-24 shrink-0"
            />
          ) : (
            <span className="w-24 h-24 rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center shrink-0">
              {initials}
            </span>
          )}

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            {profile.username && (
              <p className="text-gray-400 text-sm">@{profile.username}</p>
            )}
            {memberSince && (
              <p className="text-gray-400 text-sm mt-1">Member since {memberSince}</p>
            )}

            {/* Rating summary */}
            {avgRating !== null ? (
              <div className="mt-3 flex flex-col sm:flex-row items-center sm:items-start gap-2">
                <StarRating value={avgRating} />
                <span className="text-gray-700 font-semibold">{avgRating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">
                  ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            ) : (
              <p className="text-gray-400 text-sm mt-3">No reviews yet</p>
            )}
          </div>

          {isOwner && (
            <Link
              href="/settings"
              className="text-sm text-blue-600 hover:underline shrink-0"
            >
              Edit Profile
            </Link>
          )}
        </div>

        {/* ── Listings ── */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Listings</h2>
          {parts.length === 0 ? (
            <p className="text-gray-400">No listings yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {parts.map((part) => (
                <Link
                  key={part.id}
                  href={`/parts/${part.id}`}
                  className="block bg-white border rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <p className="font-medium text-gray-800">{part.title}</p>
                  {part.price != null && (
                    <p className="text-green-600 font-semibold mt-1">
                      ${part.price}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Reviews ── */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Reviews
            {reviews.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({reviews.length})
              </span>
            )}
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-400">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const rName =
                  review.reviewer?.full_name ||
                  review.reviewer?.username ||
                  "Anonymous";
                const rInitials = rName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                return (
                  <div
                    key={review.id}
                    className="bg-white border rounded-xl p-4 flex gap-4"
                  >
                    {review.reviewer?.avatar_url ? (
                      <Image
                        src={review.reviewer.avatar_url}
                        alt={rName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-10 h-10 shrink-0"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 text-sm font-semibold flex items-center justify-center shrink-0">
                        {rInitials}
                      </span>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="font-medium text-gray-800 text-sm">
                          {review.reviewer?.id ? (
                            <Link
                              href={`/user/${review.reviewer.id}`}
                              className="hover:text-blue-600"
                            >
                              {rName}
                            </Link>
                          ) : (
                            rName
                          )}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <StarRating value={review.rating} />
                      {review.comment && (
                        <p className="text-gray-600 text-sm mt-1">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Leave a review ── */}
        {canReview && (
          <section className="bg-white border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>

            {reviewSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">
                Thanks for your review!
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <InteractiveStars
                  value={reviewRating}
                  onChange={setReviewRating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  className="border w-full p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Share your experience…"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>

              {reviewError && (
                <p className="text-red-500 text-sm">{reviewError}</p>
              )}

              <button
                type="submit"
                disabled={reviewLoading}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50 font-medium text-sm"
              >
                {reviewLoading ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          </section>
        )}

        {/* Prompt non-logged-in visitors to log in before reviewing */}
        {!viewerId && (
          <p className="text-sm text-gray-400 text-center">
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        )}
      </div>
    </div>
  );
}

