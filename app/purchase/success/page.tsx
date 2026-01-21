"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams();

  const buyerId = searchParams.get("buyerId");
  const sellerId = searchParams.get("sellerId");
  const partId = searchParams.get("partId");

  useEffect(() => {
    if (!buyerId || !sellerId || !partId) return;

    const requestReview = async () => {
      await fetch("/api/reviews/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId,
          sellerId,
          partId,
        }),
      });
    };

    requestReview();
  }, [buyerId, sellerId, partId]);

  return (
    <main style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <h1>✅ Purchase Complete</h1>

      <p style={{ marginTop: 12 }}>
        Thank you for your purchase! The seller has been notified.
      </p>

      <p style={{ marginTop: 12, color: "#16a34a", fontWeight: 600 }}>
        A review request has been sent to your inbox.
      </p>
    </main>
  );
}
