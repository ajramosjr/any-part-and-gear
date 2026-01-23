"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type Listing = {
  id: number;
  title: string;
  description: string;
  price: number | null;
};

export default function EditListing() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isNaN(id)) return;

    const fetchListing = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("id, title, description, price")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        router.push("/my-listings");
        return;
      }

      setListing(data);
      setLoading(false);
    };

    fetchListing();
  }, [id, router, supabase]);

  const updateListing = async () => {
    if (!listing) return;

    const { error } = await supabase
      .from("parts")
      .update({
        title: listing.title,
        description: listing.description,
        price: listing.price,
      })
      .eq("id", listing.id);

    if (!error) {
      router.push("/my-listings");
    }
  };

  if (loading) {
    return <p className="p-6">Loading…</p>;
  }

  if (!listing) {
    return <p className="p-6">Listing not found.</p>;
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>

      <input
        className="w-full border p-2 mb-3"
        value={listing.title}
        onChange={(e) =>
          setListing({ ...listing, title: e.target.value })
        }
      />

      <textarea
        className="w-full border p-2 mb-3"
        rows={5}
        value={listing.description}
        onChange={(e) =>
          setListing({ ...listing, description: e.target.value })
        }
      />

      <input
        type="number"
        className="w-full border p-2 mb-4"
        value={listing.price ?? ""}
        onChange={(e) =>
          setListing({
            ...listing,
            price: e.target.value
              ? Number(e.target.value)
              : null,
          })
        }
      />

      <button
        onClick={updateListing}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </main>
  );
}
