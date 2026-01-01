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
  <main
    style={{
      padding: "40px",
      maxWidth: "500px",
      margin: "0 auto",
      color: "white",
    }}
  >
    <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
      Sell a Part
    </h1>

    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "15px" }}>
        <label>Part title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            background: "#111",
            color: "white",
            border: "1px solid #444",
            borderRadius: "6px",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            background: "#111",
            color: "white",
            border: "1px solid #444",
            borderRadius: "6px",
            minHeight: "100px",
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: "10px 16px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </form>

    {message && <p style={{ marginTop: "15px" }}>{message}</p>}
  </main>
);
