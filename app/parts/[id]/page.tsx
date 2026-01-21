"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getSellerLevel } from "@/lib/getSellerLevel";

export default function PartDetailPage() {
  const params = useParams();
  const partId = params.id as string;

  const [part, setPart] = useState<any>(null);
  const [sellerLevel, setSellerLevel] = useState("Bronze");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partId) return;

    const loadPart = async () => {
      const { data } = await supabase
        .from("parts")
        .select("*")
        .eq("id", partId)
        .single();

      if (data) {
        setPart(data);

        if (data.user_id) {
          const level = await getSellerLevel(data.user_id);
          setSellerLevel(level);
        }
      }

      setLoading(false);
    };

    loadPart();
  }, [partId]);

  if (loading) return <p style={{ padding: 40 }}>Loading part…</p>;
  if (!part) return <p style={{ padding: 40 }}>Part not found</p>;

  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1>{part.title}</h1>

      <p style={{ fontSize: 18, fontWeight: 600 }}>
        ${part.price}
      </p>

      <p style={{ marginTop: 12 }}>{part.description}</p>

      <p style={{ marginTop: 6 }}>
        Seller:{" "}
        <Link
          href={`/seller/${part.user_id}`}
          style={{ color: "#2563eb", fontWeight: 600 }}
        >
          View profile
        </Link>
      </p>

      <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
        Seller Level: <strong>{sellerLevel}</strong>
      </p>
    </main>
  );
}
