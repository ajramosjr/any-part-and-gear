"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SellForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("parts").insert({
      title,
      price: Number(price),
      seller_id: user.id,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/my-listings");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Part title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full"
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Posting…" : "Post Part"}
      </button>
    </form>
  );
}
