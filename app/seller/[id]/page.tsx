"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import VerifiedBadge from "@/components/VerifiedBadge";

type Profile = {
  id: string;
  username: string;
  verified: boolean;
};

type Part = {
  id: string;
  title: string;
  price: number;
};

export default function SellerProfilePage() {
  const { id } = useParams<{ id: string }>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadSeller = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, verified")
        .eq("id", id)
        .single();

      const { data: partsData } = await supabase
        .from("parts")
        .select("id, title, price")
        .eq("user_id", id);

      setProfile(profileData);
      setParts(partsData || []);
      setLoading(false);
    };

    loadSeller();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading seller…</div>;
  }

  if (!profile) {
    return <div className="p-6">Seller not found</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        {profile.username}
        {profile.verified && <VerifiedBadge />}
      </h1>

      <h2 className="text-xl font-semibold mt-6 mb-4">Listings</h2>

      {parts.length === 0 ? (
        <p className="text-gray-500">No listings yet.</p>
      ) : (
        <ul className="grid gap-4">
          {parts.map((part) => (
            <li key={part.id} className="border p-4 rounded">
              <Link href={`/parts/${part.id}`} className="font-medium">
                {part.title}
              </Link>
              <p className="text-sm text-gray-600">${part.price}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
