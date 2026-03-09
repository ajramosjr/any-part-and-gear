"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type Listing = {
  id: number;
  title: string;
  price: number | null;
  description: string | null;
};

export default function MyListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setListing(data);
      }

      setLoading(false);
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading listing…</p>;
  }

  if (!listing) {
    return <p className="p-6">Listing not found.</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>

      {listing.price && <p className="mb-2">${listing.price}</p>}

      <p>{listing.description}</p>
    </main>
  );
}
