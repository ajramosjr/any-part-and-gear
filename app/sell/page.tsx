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

  <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
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
      backgroundColor: "#ffffff",
      color: "#000000",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "16px",
    }}
  />

  <textarea
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    style={{
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
      backgroundColor: "#ffffff",
      color: "#000000",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "16px",
    }}
  />

  <button
    type="submit"
    style={{
      width: "100%",
      padding: "12px",
      backgroundColor: "#22c55e",
      color: "#000000",
      fontWeight: "bold",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
    }}
  >
    Submit
  </button>
</form>
