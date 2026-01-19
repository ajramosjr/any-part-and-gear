"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const [currentUserId, setCurrentUserId] = useState<string | null>(null);
const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/800x500?text=No+Image+Available";

export default function PartDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPart = async () => {
      const { data, error } = await supabase
  .from("parts")
  .select(`
    *,
    user:auth.users (
      email
    )
  `)
  .eq("id", id)
  .single();
      
      if (error) {
        console.error(error);
      }

      setPart(data);
      setLoading(false);
    };

    fetchPart();
  }, [id]);
supabase.auth.getUser().then(({ data }) => {
  setCurrentUserId(data.user?.id || null);
});
  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
  if (!part) return <p style={{ padding: 40 }}>Part not found</p>;

  const isOwner = currentUserId === part.user_id;
  const image = part.image || PLACEHOLDER_IMAGE;

  return (
    <div style={{ padding: 40 }}>
      <Link href="/browse" style={{ color: "#2563eb" }}>
        ← Back to Browse
      </Link>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          marginTop: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <img
          src={image}
          alt={part.title}
          style={{
            width: "100%",
            height: 360,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 20,
          }}
        />

        <h1 style={{ fontSize: 28, fontWeight: 700 }}>{part.title}</h1>
{isOwner && (
  <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
    <Link
      href={`/edit/${part.id}`}
      style={{
        padding: "10px 16px",
        borderRadius: 8,
        background: "#2563eb",
        color: "#fff",
        textDecoration: "none",
      }}
    >
      Edit Listing
    </Link>

    <button
      onClick={async () => {
        const confirmDelete = confirm(
          "Are you sure you want to delete this listing?"
        );
        if (!confirmDelete) return;

        await supabase.from("parts").delete().eq("id", part.id);
        window.location.href = "/browse";
      }}
      style={{
        padding: "10px 16px",
        borderRadius: 8,
        background: "#dc2626",
        color: "#fff",
        border: "none",
        cursor: "pointer",
      }}
    >
      Delete
    </button>
  </div>
)}
        {part.price && (
          <p style={{ fontSize: 20, fontWeight: 600, marginTop: 8 }}>
            ${part.price}
          </p>
        )}

        <p style={{ marginTop: 16 }}>{part.description}</p>
{part.user?.email && (
  <p style={{ color: "#555", marginTop: 8 }}>
    Seller: {part.user.email}
  </p>
)}
        {part.created_at && (
          <p style={{ color: "#666", marginTop: 16 }}>
            Listed on {new Date(part.created_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
