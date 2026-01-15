"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SellPage() {
  const [title, setTitle] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("parts").insert({ title });

    if (error) {
      alert(error.message);
    } else {
      setTitle("");
      alert("Part posted!");
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Sell a Part</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Part name"
        />
        <button type="submit">Post</button>
      </form>
    </main>
  );
}
