"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

export default function SellPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const submitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("parts").insert({
      title,
      description,
      price: price ? Number(price) : null,
      user_id: user.id,
      trade_available: true,
    });

    setLoading(false);

    if (!error) {
      router.push("/my-listings");
    } else {
      alert(error.message);
    }
  };

  return (
    <RequireAuth>
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Sell a Part</h1>

        <form onSubmit={submitListing} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Part title"
            required
            className="w-full border rounded p-2"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className="w-full border rounded p-2"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price (optional)"
            className="w-full border rounded p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Posting…" : "Post Listing"}
          </button>
        </form>
      </main>
    </RequireAuth>
  );
}
