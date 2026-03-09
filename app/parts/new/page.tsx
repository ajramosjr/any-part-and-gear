"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

export default function NewPartPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tradeAvailable, setTradeAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
      trade_available: tradeAvailable,
      user_id: user.id,
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
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Part</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded p-2"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border rounded p-2"
          />

          <input
            type="number"
            placeholder="Price (optional)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded p-2"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={tradeAvailable}
              onChange={(e) => setTradeAvailable(e.target.checked)}
            />
            Open to trade
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create Part"}
          </button>
        </form>
      </main>
    </RequireAuth>
  );
}
