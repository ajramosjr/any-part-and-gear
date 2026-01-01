"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

if (!description.trim()) {
  toast.error("Description is empty");
  setLoading(false);
  return;
}
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  console.log("Submitting:", { title, description });

  if (!title.trim()) {
    toast.error("Title is required");
    setLoading(false);
    return;
  }

  if (!description.trim()) {
    toast.error("Description is empty");
    setLoading(false);
    return;
  }

  const { error } = await supabase.from("parts").insert([
    { title, description },
  ]);

  setLoading(false);

  if (error) {
    console.error(error);
    toast.error("Failed to list part");
  } else {
    toast.success("Part listed successfully");
    setTitle("");
    setDescription("");
  }
}  

  return (
    <main style={{ padding: 40, maxWidth: 500 }}>
      <Toaster position="top-right" />

      <h1>Sell a Part</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Part title"
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          rows={4}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
