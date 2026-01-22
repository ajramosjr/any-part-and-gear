"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import VerifiedBadge from "@/components/VerifiedBadge";

type Profile = {
  id: string;
  username: string | null;
  bio: string | null;
  verified: boolean;
};

type Part = {
  id: string;
  title: string;
  price: number;
  image_urls: string[] | null;
  trade_available: boolean;
};

export default function SellerProfilePage() {
  const { id } = useParams();
  const sellerId = id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      setLoading(true);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sellerId)
        .single();

      const { data: partsData } = await supabase
        .from("parts")
        .select("*")
        .eq("user_id", sellerId)
        .order("created_at", { ascending: false });

      setProfile(profileData);
      setParts(partsData || []);
      setLoading(false);
    };

    fetchSeller();
  }, [sellerId]);

  if (loading) return <p style={{ padding: 20 }}>Loading seller...</p>;
  if (!profile) return <p style={{ padding: 20 }}>Seller not found</p>;

  return (
    <div style={{ padding: 20 }}>
      {/* SELLER HEADER */}
      <div style={{ marginBottom: 24 }}>
        <h1>
          {profile.username || "Seller"}
          {profile.verified && <VerifiedBadge />}
        </h1>

        {profile.bio && (
          <p style={{ color: "#666", marginTop: 8 }}>{profile.bio}</p>
        )}
      </div>

      {/* LISTINGS */}
      <h2>Listings</h2>

      {parts.length === 0 && <p>No listings yet</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {parts.map((part) => (
          <div
            key={part.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <Link href={`/parts/${part.id}`}>
              {part.image_urls?.[0] && (
                <img
                  src={part.image_urls[0]}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              )}

              <h3>{part.title}</h3>
              <p>${part.price}</p>

              {part.trade_available && (
                <small style={{ color: "#0d6efd" }}>
                  Trade Available
                </small>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
