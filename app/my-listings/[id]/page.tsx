"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type Listing = {
  id: number;
  title: string;
  price: number | null;
  description: string | null;
};

export default function MyListingPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

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
  }, [id, supabase]);

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
