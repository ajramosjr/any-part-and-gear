"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SellClient() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("parts").insert([
      { title }
    ]);

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Part listed successfully!");
      setTitle("");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "400px",
      }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Part title"
        required
        style={{ padding: "8px" }}
      />

      <button disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
