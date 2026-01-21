"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import SellerReviewForm from "@/components/SellerReviewForm";

type Review = {
  rating: number;
  comment: string | null;
  created_at: string;
};

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params.id as string;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      const { data, error } = await supabase
        .from("seller_reviews")
        .select("rating, comment, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews(data);

        if (data.length > 0) {
          const total = data.reduce((sum, r) => sum + r.rating, 0);
          setAvg(Number((total / data.length).toFixed(1)));
        }
      }

      setLoading(false);
    };

    loadReviews();
  }, [sellerId]);

  return (
    <main style={{ padding: 40 }}>
      <h1>Seller Profile</h1>

      <h2 style={{ marginTop: 30 }}>
        Rating: {avg ? `${avg} ⭐` : "No reviews yet"}
      </h2>

      {loading && <p>Loading reviews...</p>}

      {!loading &&
        reviews.map((r, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 12,
              marginTop: 10,
            }}
          >
            <span style={{ color: "#f59e0b" }}>
  {"★".repeat(Math.round(sellerRating))}
</span>
<span style={{ color: "#64748b", marginLeft: 4 }}>
  {sellerRating}
</span>
            <strong>{r.rating} ⭐</strong>
            {r.comment && <p style={{ marginTop: 6 }}>{r.comment}</p>}
          </div>
        ))}

      <SellerReviewForm sellerId={sellerId} />
    </main>
  );
}
