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
  id: string;
  title: string;
  price: number | null;
};

export default function SellerProfilePage() {
  const supabase = createClient();
  const params = useParams();
  const sellerId = params?.id as string | undefined;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

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

    fetchSeller();
  }, [sellerId, supabase]);

  if (loading) {
    return <p className="p-6">Loading seller…</p>;
  }

  if (!profile) {
    return <p className="p-6">Seller not found.</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-2xl font-bold">
          {profile.username ?? "Seller"}
        </h1>
        {profile.verified && <VerifiedBadge />}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {profile.verified
          ? "Verified seller on Any-Part & Gear"
          : "Seller on Any-Part & Gear"}
      </p>

      <h2 className="text-lg font-semibold mb-4">Listings</h2>

      {parts.length === 0 && (
        <p className="text-gray-500">No listings yet.</p>
      )}

      <ul className="space-y-3">
        {parts.map((part) => (
          <li
            key={part.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <Link
              href={`/parts/${part.id}`}
              className="font-medium hover:underline"
            >
              {part.title}
            </Link>
            {part.price !== null && (
              <span className="text-gray-700">${part.price}</span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
