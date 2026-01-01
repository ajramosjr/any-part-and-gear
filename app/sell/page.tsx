"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("parts").insert([
      {
        title,
        description,
      },
    ]);

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Part listed successfully!");
      setTitle("");
      setDescription("");
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1>Sell a Part</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Part title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            padding: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
            color: "#000",
          }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
          style={{
            padding: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
            color: "#000",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "16px", fontWeight: "bold" }}>{message}</p>
      )}
    </main>
  );
}
