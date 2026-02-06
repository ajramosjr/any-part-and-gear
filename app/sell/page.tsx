"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/app/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";

export default function SellPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("parts").insert({
      title,
      price: Number(price),
      description,
      user_id: user.id,
    });

    setLoading(false);

    if (!error) {
      router.push("/");
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
            type="text"
            placeholder="Part title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded p-2"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2 min-h-[120px]"
            required
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
