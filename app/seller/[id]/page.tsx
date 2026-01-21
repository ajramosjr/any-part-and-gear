"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";
import Link from "next/link";

type Part = {
  id: string;
  title: string;
  price: number;
};

export default function SellerProfilePage() {
  const { id: sellerId } = useParams();
  const router = useRouter();

  const [parts, setParts] = useState<Part[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

    const load = async () => {
      // 🔹 Seller info
      const { data: user } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", sellerId)
        .single();

      setEmail(user?.email ?? null);

      // 🔹 Seller listings
      const { data: parts } = await supabase
        .from("parts")
        .select("id, title, price")
        .eq("user_id", sellerId);

      setParts(parts || []);
      setLoading(false);
    };

    load();
  }, [sellerId]);

  if (loading) return <p style={{ padding: 40 }}>Loading seller…</p>;

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 900 }}>
        <h1>Seller Profile</h1>

        <p style={{ color: "#555" }}>
          Contact seller: <strong>{email}</strong>
        </p>

        <h2 style={{ marginTop: 30 }}>Listings</h2>

        {parts.length === 0 && <p>No listings yet.</p>}

        <div style={{ marginTop: 20 }}>
          {parts.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #e5e7eb",
                padding: 16,
                borderRadius: 10,
                marginBottom: 16,
              }}
            >
              <h3>{p.title}</h3>
              <p>${p.price}</p>

              <div style={{ display: "flex", gap: 12 }}>
                <Link href={`/parts/${p.id}`}>
                  View Listing
                </Link>

                <button
                  onClick={() =>
                    router.push(`/parts/${p.id}/messages`)
                  }
                  style={{
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Message Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </RequireAuth>
  );
}
