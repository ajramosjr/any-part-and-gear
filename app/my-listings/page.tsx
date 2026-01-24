"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

type Listing = {
  id: number;
  title: string;
  price: number | null;
};

export default function MyListingsPage() {
  const supabase = createClient();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

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
        .select("id, title, price")
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
    <RequireAuth>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Listings</h1>

        {listings.length === 0 && (
          <p className="text-gray-500">
            You haven’t listed anything yet.
          </p>
        )}

        <ul className="space-y-4">
          {listings.map((listing) => (
            <li
              key={listing.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{listing.title}</h3>
                {listing.price && (
                  <p className="text-sm text-gray-600">
                    ${listing.price}
                  </p>
                )}
              </div>

              <Link
                href={`/my-listings/${listing.id}`}
                className="text-blue-600 underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </RequireAuth>
  );
}
