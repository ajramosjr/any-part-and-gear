"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("parts").insert([
      { title, description },
    ]);

    if (error) {
      setMessage("❌ Error listing part");
    } else {
      setMessage("✅ Part listed successfully!");
      setTitle("");
      setDescription("");
    }
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Sell a Part</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          placeholder="Part title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
