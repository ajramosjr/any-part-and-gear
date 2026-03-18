"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, Pencil, Package, MessageSquare } from "lucide-react";
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

function avatarInitials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 0)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({
  value,
  max = 5,
  size = "md",
}: {
  value: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const cls = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < Math.round(value) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
          strokeWidth={0}
        />
      ))}
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
    <span className="inline-flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform hover:scale-125"
          aria-label={`${star} star`}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              star <= (hovered || value)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200 fill-gray-200"
            }`}
            strokeWidth={0}
          />
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

  const [viewerId, setViewerId] = useState<string | null>(null);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

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
      {
        data: { user },
      },
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
    if (vid) setAlreadyReviewed(reviewList.some((r) => r.reviewer?.id === vid));

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">User not found.</p>
      </div>
    );
  }

  const displayName = profile.full_name || profile.username || "User";
  const initials = avatarInitials(displayName);
  const isOwner = viewerId === userId;
  const canReview = viewerId && !isOwner && !alreadyReviewed;
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-500 pt-14 pb-24 text-white text-center px-4">
        <div className="flex justify-center mb-4">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={displayName}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-white/30 shadow-xl"
            />
          ) : (
            <span className="w-24 h-24 rounded-full bg-white/20 text-white text-3xl font-bold flex items-center justify-center ring-4 ring-white/30 shadow-xl">
              {initials}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold">{displayName}</h1>
        {profile.username && (
          <p className="text-blue-200 text-sm mt-0.5">@{profile.username}</p>
        )}
        {memberSince && (
          <p className="text-blue-200 text-xs mt-1">Member since {memberSince}</p>
        )}

        {avgRating !== null ? (
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2 mt-4">
            <StarRating value={avgRating} />
            <span className="font-bold text-sm">{avgRating.toFixed(1)}</span>
            <span className="text-blue-200 text-xs">
              · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        ) : (
          <p className="text-blue-200 text-xs mt-3">No reviews yet</p>
        )}

        {isOwner && (
          <div className="mt-5">
            <Link
              href="/settings"
              className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition rounded-full px-5 py-2 text-sm font-medium"
            >
              <Pencil className="w-4 h-4" strokeWidth={2} />
              Edit Profile
            </Link>
          </div>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 space-y-6 pb-16">

        {/* Stat chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="flex justify-center mb-1">
              <Package className="w-5 h-5 text-blue-400" strokeWidth={1.75} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{parts.length}</p>
            <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">Listings</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="flex justify-center mb-1">
              <MessageSquare className="w-5 h-5 text-blue-400" strokeWidth={1.75} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">Reviews</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center col-span-2 sm:col-span-1">
            <div className="flex justify-center mb-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" strokeWidth={0} />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {avgRating !== null ? avgRating.toFixed(1) : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">Avg Rating</p>
          </div>
        </div>

        {/* ── Listings ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" strokeWidth={1.75} />
            Listings
          </h2>
          {parts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-400 text-sm">
              No listings yet.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {parts.map((part) => (
                <Link
                  key={part.id}
                  href={`/parts/${part.id}`}
                  className="block bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-blue-100 transition-all"
                >
                  <p className="font-medium text-gray-800 text-sm">{part.title}</p>
                  {part.price != null && (
                    <p className="text-green-600 font-bold mt-1 text-sm">${part.price}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Reviews ── */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" strokeWidth={0} />
            Reviews
            {reviews.length > 0 && (
              <span className="text-sm font-normal text-gray-400">
                ({reviews.length})
              </span>
            )}
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-400 text-sm">
              No reviews yet.
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => {
                const rName =
                  review.reviewer?.full_name || review.reviewer?.username || "Anonymous";
                const rInitials = avatarInitials(rName);
                return (
                  <div
                    key={review.id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-4"
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
                      <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center shrink-0">
                        {rInitials}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
                        <span className="font-semibold text-gray-800 text-sm">
                          {review.reviewer?.id ? (
                            <Link
                              href={`/user/${review.reviewer.id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {rName}
                            </Link>
                          ) : (
                            rName
                          )}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <StarRating value={review.rating} size="sm" />
                      {review.comment && (
                        <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
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
          <section className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" strokeWidth={0} />
              Leave a Review
            </h2>

            {reviewSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm border border-green-200">
                Thanks for your review! 🎉
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Your Rating
                </label>
                <InteractiveStars value={reviewRating} onChange={setReviewRating} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Comment <span className="text-gray-300 normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  rows={3}
                  placeholder="Share your experience with this seller…"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>

              {reviewError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {reviewError}
                </div>
              )}

              <button
                type="submit"
                disabled={reviewLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50 shadow-sm shadow-blue-200 text-sm"
              >
                {reviewLoading ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          </section>
        )}

        {!viewerId && (
          <p className="text-sm text-gray-400 text-center pb-4">
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        )}
      </div>
    </div>
  );
}
