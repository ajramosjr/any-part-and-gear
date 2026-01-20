"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Part = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  image: string | null;
  created_at: string;
  user_id: string;
};

export default function PartPage() {
  const params = useParams();
  const router = useRouter();

  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (!params?.id) return;

    const fetchPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        router.push("/browse");
        return;
      }

      setPart(data);
      setLoading(false);
    };

    fetchPart();
  }, [params, router]);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading part…</p>;
  }

  if (!part) return null;

  return (
    <main style={{ padding: 40, maxWidth: 1000, margin: "0 auto" }}>
      <Link href="/browse" style={{ color: "#2563eb" }}>
        ← Back to Browse
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          marginTop: 24,
        }}
      >
        {/* Image */}
        <div>
          {part.image ? (
            <img
              src={part.image}
              alt={part.title}
              onClick={() => setShowImage(true)}
              style={{
                width: "100%",
                maxHeight: 420,
                objectFit: "cover",
                borderRadius: 20,
                boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                cursor: "zoom-in",
              }}
            />
          ) : (
            <div
              style={{
                height: 420,
                background: "#e5e7eb",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              No Image
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 style={{ marginBottom: 12 }}>{part.title}</h1>

          <p
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            ${part.price}
          </p>

          {part.description && (
            <p style={{ marginBottom: 24 }}>{part.description}</p>
          )}

          <button
            style={{
              padding: "14px 24px",
              fontSize: 16,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: "#0f172a",
              color: "#fff",
              marginRight: 12,
            }}
          >
            Message Seller
          </button>

          <button
            style={{
              padding: "14px 24px",
              fontSize: 16,
              borderRadius: 999,
              border: "2px solid #0f172a",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Make Trade Offer
          </button>
        </div>
      </div>

      {/* FULLSCREEN IMAGE MODAL */}
      {showImage && part.image && (
        <div
          onClick={() => setShowImage(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={part.image}
            alt={part.title}
            style={{
              maxWidth: "95%",
              maxHeight: "95%",
              borderRadius: 16,
            }}
          />
        </div>
      )}
    </main>
  );
}
