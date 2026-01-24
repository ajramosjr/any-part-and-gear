"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import VerifiedBadge from "@/components/VerifiedBadge";

type Profile = {
  id: string;
  username: string | null;
  verified: boolean;
};

type Part = {
  id: number;
  title: string;
  price: number | null;
};

export default function SellerProfilePage() {
  const supabase = createClient();
  const params = useParams();
  const sellerId = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, verified")
        .eq("id", sellerId)
        .single();

      const { data: partsData } = await supabase
        .from("parts")
        .select("id, title, price")
        .eq("user_id", sellerId)
        .order("created_at", { ascending: false });

      setProfile(profileData ?? null);
      setParts(partsData ?? []);
      setLoading(false);
    };

    if (sellerId) fetchSeller();
  }, [sellerId, supabase]);

  if (loading) {
    return <p className="p-6">Loading seller…</p>;
  }

  if (!profile) {
    return <p className="p-6">Seller not found.</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">
          {profile.username ?? "Seller"}
        </h1>
        {profile.verified && <VerifiedBadge />}
      </div>

      <h2 className="text-lg font-semibold mb-4">Listings</h2>

      {parts.length === 0 && (
        <p className="text-gray-500">No listings yet.</p>
      )}

      <ul className="space-y-3">
        {parts.map((part) => (
          <li
            key={part.id}
            className="border rounded p-3 flex justify-between"
          >
            <Link
              href={`/parts/${part.id}`}
              className="font-medium hover:underline"
            >
              {part.title}
            </Link>
            {part.price && <span>${part.price}</span>}
          </li>
        ))}
      </ul>
    </main>
  );
}
