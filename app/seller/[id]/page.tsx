"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getSellerTier } from "@/lib/getSellerTier";
import { isVerifiedSeller } from "@/lib/isVerifiedSeller";
import { getTrustScore } from "@/lib/getTrustScore";
import SellerBadge from "@/components/SellerBadge";
import VerifiedBadge from "@/components/VerifiedBadge";
import TrustScore from "@/components/TrustScore";

export default function SellerProfilePage() {
  const { id } = useParams();
  const sellerId = id as string;

  const [reviews, setReviews] = useState<any[]>([]);
  const [tier, setTier] =
    useState<"Bronze" | "Silver" | "Gold">("Bronze");
  const [verified, setVerified] = useState(false);
  const [trust, setTrust] = useState(0);

  useEffect(() => {
    if (!sellerId) return;

    const load = async () => {
      const { data } = await supabase
        .from("seller_reviews")
        .select("rating, comment, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      setReviews(data || []);
      setTier(await getSellerTier(sellerId));
      setVerified(await isVerifiedSeller(sellerId));
      setTrust(await getTrustScore(sellerId));
    };

    load();
  }, [sellerId]);

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>Seller Profile</h1>

      <p style={{ marginTop: 6 }}>
        <SellerBadge tier={tier} />
        {verified && <VerifiedBadge />}
        <TrustScore score={trust} />
      </p>

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
        </div>
      ))}
    </main>
  );
}
