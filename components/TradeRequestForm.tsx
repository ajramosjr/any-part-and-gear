"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/supabaseClient";
import TradeRequestForm from "@/components/TradeRequestForm";

type Profile = {
  id: string;
  username: string;
  verified: boolean;
};

type Part = {
  id: string;
  title: string;
  description: string;
};

export default function SellerPage() {
  const params = useParams();
  const sellerId = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeller = async () => {
      // Fetch seller profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, verified")
        .eq("id", sellerId)
        .single();

      // Fetch seller parts
      const { data: partsData } = await supabase
        .from("parts")
        .select("id, title, description")
        .eq("owner_id", sellerId);

      setProfile(profileData);
      setParts(partsData || []);
      setLoading(false);
    };

    loadSeller();
  }, [sellerId]);

  if (loading) {
    return <p>Loading seller...</p>;
  }

  if (!profile) {
    return <p>Seller not found</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <Link href="/">← Back</Link>

      <h1 style={{ marginTop: 12 }}>
        {profile.username}{" "}
        {profile.verified && (
          <span style={{ color: "gold" }}>✔ Verified</span>
        )}
      </h1>

      <h2 style={{ marginTop: 24 }}>Parts for Trade</h2>

      {parts.length === 0 && <p>No parts listed</p>}

      {parts.map((part) => (
        <div
          key={part.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: 12,
            marginTop: 12,
          }}
        >
          <h3>{part.title}</h3>
          <p>{part.description}</p>

          <TradeRequestForm
            partId={part.id}
            receiverId={profile.id}
          />
        </div>
      ))}
    </div>
  );
}
