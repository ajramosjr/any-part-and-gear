"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("parts").insert([
      {
        title,
        description,
      },
    ]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Part listed successfully!");
      setTitle("");
      setDescription("");
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: "40px", maxWidth: "600px" }}>
      <h1>Sell a Part</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <input
          type="text"
          placeholder="Part title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 🔥 THIS IS THE DESCRIPTION FIELD */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
