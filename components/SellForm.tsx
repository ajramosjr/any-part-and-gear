"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SellForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitListing = async () => {
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("parts").insert({
      title,
      description,
      price: Number(price),
      user_id: user.id,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/my-listings");
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Sell a Part</h1>

      {error && <p className="text-red-500">{error}</p>}

      <input
        className="border p-2 w-full rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border p-2 w-full rounded"
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <textarea
        className="border p-2 w-full rounded"
        placeholder="Description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={submitListing}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post Listing"}
      </button>

      <Link href="/my-listings" className="block text-sm text-blue-600">
        Cancel
      </Link>
    </div>
  );
}
