"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase.from("parts").insert([
      { title, description }
    ]);

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Part listed successfully!");
      setTitle("");
      setDescription("");
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Sell a Part</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <input
          placeholder="Part title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 12 }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ display: "block", width: "100%", marginBottom: 12 }}
        />

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
