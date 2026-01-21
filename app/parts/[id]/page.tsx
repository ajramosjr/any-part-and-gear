"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function PartPage() {
  const params = useParams();
  const router = useRouter();
  const partId = params.id as string;

  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", partId)
        .single();

      if (!error) setPart(data);
      setLoading(false);
    };

    fetchPart();
  }, [partId]);

  if (loading) return <p>Loading...</p>;
  if (!part) return <p>Part not found.</p>;

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>{part.title}</h1>

      <p style={{ marginTop: 12 }}>{part.description}</p>

      <p style={{ fontWeight: 600, marginTop: 10 }}>
        Price: ${part.price}
      </p>

      {/* Seller profile link */}
      <p style={{ marginTop: 6 }}>
        Seller:{" "}
        <Link
          href={`/seller/${part.user_id}`}
          style={{ color: "#2563eb", fontWeight: 600 }}
        >
          View profile
        </Link>
      </p>

      {/* Message seller button */}
      <button
        onClick={() =>
          router.push(
            `/messages/send?partId=${part.id}&sellerId=${part.user_id}`
          )
        }
        style={{
          marginTop: 24,
          padding: "12px 18px",
          borderRadius: 10,
          background: "#0f172a",
          color: "#facc15",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
        }}
      >
        Message Seller
      </button>
    </main>
  );
}
