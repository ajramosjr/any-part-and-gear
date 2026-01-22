"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getSellerTier } from "@/lib/getSellerTier";
import { isVerifiedSeller } from "@/lib/isVerifiedSeller";
import SellerBadge from "@/components/SellerBadge";
import VerifiedBadge from "@/components/VerifiedBadge";

export default function PartPage() {
  const { id } = useParams();
  const [part, setPart] = useState<any>(null);
  const [tier, setTier] =
    useState<"Bronze" | "Silver" | "Gold">("Bronze");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const { data } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .single();

      setPart(data);

      const sellerTier = await getSellerTier(data.user_id);
      setTier(sellerTier);

      const isVerified = await isVerifiedSeller(data.user_id);
      setVerified(isVerified);
    };

    load();
  }, [id]);

  if (!part) return <p style={{ padding: 40 }}>Loading…</p>;

  return (
    <main style={{ padding: 40, maxWidth: 700 }}>
      <h1>{part.title}</h1>

      <p style={{ marginTop: 6 }}>
        Seller:{" "}
        <Link
          href={`/seller/${part.user_id}`}
          style={{ fontWeight: 600, color: "#2563eb" }}
        >
          View profile
        </Link>

        <SellerBadge tier={tier} />
        {verified && <VerifiedBadge />}
      </p>

      <p style={{ marginTop: 20 }}>{part.description}</p>
    </main>
  );
}
