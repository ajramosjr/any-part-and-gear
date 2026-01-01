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
  }}
>
  <h1>Sell a Part</h1>

  <form onSubmit={handleSubmit}>
    {/* TITLE INPUT */}
    <input
      type="text"
      placeholder="Part title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "12px",
        backgroundColor: "#111",
        color: "white",
        border: "1px solid #555",
        borderRadius: "6px",
      }}
    />

    {/* DESCRIPTION INPUT */}
    <textarea
      placeholder="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "12px",
        backgroundColor: "#111",
        color: "white",
        border: "1px solid #555",
        borderRadius: "6px",
      }}
    />

    {/* SUBMIT BUTTON */}
    <button
      type="submit"
      style={{
        padding: "12px",
        width: "100%",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Submit
    </button>
  </form>

  {message && <p style={{ marginTop: "12px" }}>{message}</p>}
</main>
