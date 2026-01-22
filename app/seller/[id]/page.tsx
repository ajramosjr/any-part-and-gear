"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import VerifiedBadge from "@/components/VerifiedBadge";
import SellerBadge from "@/components/SellerBadge";

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params.id as string;

  const [verified, setVerified] = useState(false);
  const [tier, setTier] = useState<"Bronze" | "Silver" | "Gold">("Bronze");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

    const loadSeller = async () => {
      // seller info
      const { data: seller } = await supabase
        .from("profiles")
        .select("verified, seller_tier")
        .eq("id", sellerId)
        .single();

      setVerified(!!seller?.verified);
      setTier(seller?.seller_tier ?? "Bronze");

      // reviews
      const { data: reviewData } = await supabase
        .from("seller_reviews")
        .select("rating, comment, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      setReviews(reviewData || []);
      setLoading(false);
    };

    loadSeller();
  }, [sellerId]);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading seller profile…</p>;
  }

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>Seller Profile</h1>

      {/* ✅ ALWAYS pass the prop */}
      <div style={{ marginTop: 8 }}>
        <SellerBadge tier={tier} />
        <VerifiedBadge verified={verified} />
      </div>

      {!verified && (
        <p style={{ color: "#666", marginTop: 6 }}>
          This seller has not yet been verified.
        </p>
      )}

      <h3 style={{ marginTop: 32 }}>Reviews</h3>

      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((r, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 10,
            marginBottom: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <strong>⭐ {r.rating}/5</strong>
          <p>{r.comment}</p>
          <p style={{ fontSize: 12, color: "#666" }}>
            {new Date(r.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </main>
  );
}
