"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function PurchaseSuccessPage() {
  const params = useSearchParams();

  useEffect(() => {
    const createReviewRequest = async () => {
      const partId = params.get("partId");
      const sellerId = params.get("sellerId");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !partId || !sellerId) return;

      await fetch("/api/reviews/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: user.id,
          sellerId,
          partId,
        }),
      });
    };

    createReviewRequest();
  }, [params]);

  return (
    <main style={{ padding: 40 }}>
      <h1>Purchase Complete 🎉</h1>
      <p>Thanks for your purchase!</p>
    </main>
  );
}
