"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import VerifiedBadge from "@/components/VerifiedBadge";

export default function SellerProfilePage() {
  const { id } = useParams();
  const sellerId = id as string;

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

    const loadSeller = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("verified")
        .eq("id", sellerId)
        .single();

      setVerified(!!data?.verified);
      setLoading(false);
    };

    loadSeller();
  }, [sellerId]);

  if (loading) return <p style={{ padding: 40 }}>Loading seller…</p>;

  return (
    <main style={{ padding: 40 }}>
      <h1>Seller Profile</h1>

      {verified && <VerifiedBadge />}

      {!verified && (
        <p style={{ color: "#666", marginTop: 8 }}>
          Seller not yet verified
        </p>
      )}
    </main>
  );
}
