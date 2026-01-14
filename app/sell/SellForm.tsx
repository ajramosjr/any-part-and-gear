"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

export default function SellForm() {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("parts").insert({
      title,
      price: Number(price),
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Part listed!");
      setTitle("");
      setPrice("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Part name"
        className="w-full border p-2"
      />

      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        type="number"
        className="w-full border p-2"
      />

      <button className="bg-black text-white px-4 py-2">
        List Part
      </button>
    </form>
  );
}
