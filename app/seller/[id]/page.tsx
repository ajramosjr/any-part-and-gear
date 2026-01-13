"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: string;
  title: string;
  description?: string;
};

export default function SellerPage({ params }: { params: { id: string } }) 
 const sellerId = params.id;

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParts = async () => {
      const { data } = await supabase
        .from("parts")
        .select("*")
        .eq("user_id", sellerId)
        .order("created_at", { ascending: false });

      setParts(data ?? []);
      setLoading(false);
    };

    loadParts();
  }, [sellerId, supabase]);

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ padding: 40 }}>
      <Link href="/browse">← Back to Browse</Link>

      <h1 style={{ marginTop: 20 }}>Seller Listings</h1>

      {parts.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div style={{ marginTop: 20 }}>
          {parts.map((part) => (
            <div
              key={part.id}
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 10,
                marginBottom: 12,
              }}
            >
              <h3>{part.title}</h3>
              <p>{part.description}</p>

              <Link href={`/parts/${part.id}`}>View Part</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
