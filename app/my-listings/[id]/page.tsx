"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Listing = {
  id: number;
  title: string;
  price: number | null;
  description: string | null;
  image_url: string | null;
  city: string | null;
  state: string | null;
};

export default function MyListingPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setListing(data);
      }

      setLoading(false);
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading listing...</p>;
  }

  if (!listing) {
    return <p className="p-6">Listing not found.</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        {listing.title}
      </h1>

      <img
        src={listing.image_url || "/placeholder.png"}
        className="w-full max-h-[400px] object-cover rounded-lg mb-6"
        alt={listing.title}
      />

      {listing.price && (
        <p className="text-2xl font-semibold mb-4">
          ${listing.price}
        </p>
      )}

      {(listing.city || listing.state) && (
        <p className="text-gray-500 mb-4">
          📍 {listing.city} {listing.state}
        </p>
      )}

      {listing.description && (
        <p className="mb-8 text-gray-700">
          {listing.description}
        </p>
      )}

      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Contact Buyer
      </button>

    </main>
  );
}
