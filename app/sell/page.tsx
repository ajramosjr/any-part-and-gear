"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [fitment, setFitment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("parts").insert({
      title,
      price: Number(price),
      fitment,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Part listed!");
      setTitle("");
      setPrice("");
      setFitment("");
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sell a Part</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Part title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Fitment (optional)"
          value={fitment}
          onChange={(e) => setFitment(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-yellow-500 text-black p-2 rounded font-medium hover:bg-yellow-400"
        >
          {loading ? "Listing..." : "List Part"}
        </button>
      </form>
    </main>
  );
}
