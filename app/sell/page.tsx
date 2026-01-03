"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SellPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));

    const { error } = await supabase.from("parts").insert([
      { title, description, price },
    ]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Part listed successfully");
      e.currentTarget.reset();
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 40, maxWidth: 600 }}>
      <h1>Sell a Part</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input name="title" placeholder="Part title" required />

        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          required
        />

        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
