"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SellForm() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("parts").insert({
      title,
    });

    if (error) {
      setError(error.message);
    } else {
      setTitle("");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 40 }}>
      <h1>Sell a Part</h1>

      <input
        type="text"
        placeholder="Part title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ display: "block", marginBottom: 12 }}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Posting…" : "Post Part"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
