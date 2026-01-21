"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params.id as string;

  const [sellerEmail, setSellerEmail] = useState<string | null>(null);
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

    const loadSeller = async () => {
      // 🔹 Get seller email
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", sellerId)
        .single();

      if (!userError && userData) {
        setSellerEmail(userData.email);
      }

      // 🔹 Get seller parts
      const { data: partsData } = await supabase
        .from("parts")
        .select("*")
        .eq("user_id", sellerId)
        .order("created_at", { ascending: false });

      setParts(partsData || []);
      setLoading(false);
    };

    loadSeller();
  }, [sellerId]);

  if (loading) return <p style={{ padding: 40 }}>Loading seller…</p>;

  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>
        Seller Profile
      </h1>

      <p style={{ color: "#475569", marginBottom: 30 }}>
        {sellerEmail || "Seller"}
      </p>

      <h2 style={{ fontSize: 20, marginBottom: 16 }}>
        Listings
      </h2>

      {parts.length === 0 && <p>No listings yet.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        {parts.map((part) => (
          <Link
            key={part.id}
            href={`/parts/${part.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ fontWeight: 600 }}>
              {part.title}
            </h3>

            {part.price && (
              <p style={{ marginTop: 6, fontWeight: 500 }}>
                ${part.price}
              </p>
            )}

            <p
              style={{
                fontSize: 13,
                color: "#64748b",
                marginTop: 8,
              }}
            >
              {new Date(part.created_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
