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
      {
        title,
        description,
      },
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
    <main style={{ padding: "40px", maxWidth: "500px" }}>
      <h1>Sell a Part</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Part Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
