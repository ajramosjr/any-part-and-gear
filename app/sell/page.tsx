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
      <h1>Sell a Part</h1>
<main
  style={{
    background: "#ffffff",
    color: "#000000",
    minHeight: "100vh",
    padding: "40px",
  }}
>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
  style={{
    background: "#fff",
    color: "#000",
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "6px",
  }}
  ...
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
