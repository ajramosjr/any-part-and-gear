"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

type Listing = {
  id: number;
  title: string;
  price: number | null;
  trade_available: boolean;
  created_at: string;
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchListings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("parts")
        .select("id,title,price,trade_available,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setListings(data);
      }

      setLoading(false);
    };

    fetchListings();
  }, [supabase]);

  if (loading) {
    return <p className="p-6">Loading your listings…</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Listings</h1>

      {listings.length === 0 && (
        <p className="text-gray-500">You haven’t posted any listings yet.</p>
      )}

      {listings.map((listing) => (
        <div
          key={listing.id}
          className="border rounded-lg p-4 mb-4 flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold text-lg">{listing.title}</h3>

            <p className="text-xs text-gray-500">
              Posted {new Date(listing.created_at).toLocaleDateString()}
            </p>

            {listing.price !== null && (
              <p className="text-gray-700">${listing.price}</p>
            )}

            {listing.trade_available && (
              <p className="text-sm text-green-600">Trade available</p>
            )}
          </div>

          <Link
            href={`/parts/${listing.id}`}
            className="text-blue-600 hover:underline text-sm"
          >
            View
          </Link>
        </div>
      ))}
    </main>
  );
}
