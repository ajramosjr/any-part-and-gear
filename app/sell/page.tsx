"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

export default function SellPage() {
  const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [price, setPrice] = useState("");
const [category, setCategory] = useState("");
  
await supabase.from("parts").insert({
  title,
  description,
  price,
  image_url,
  category,
});
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
  style={{ display: "flex", flexDirection: "column", gap: "16px" }}
>
  {/* Category */}
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="border p-2 w-full"
    required
  >
    <option value="">Select category</option>
    <option value="engine">Engine</option>
    <option value="brakes">Brakes</option>
    <option value="suspension">Suspension</option>
    <option value="electrical">Electrical</option>
  </select>

  {/* Title */}
  <input
    type="text"
    placeholder="Part title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="border p-2 w-full"
    required
  />

  {/* Price */}
  <input
    type="number"
    step="0.01"
    placeholder="Price (USD)"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    className="border p-2 w-full"
    required
  />

  {/* Description */}
  <textarea
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    rows={5}
    className="border p-2 w-full"
    required
  />

  {/* Image */}
  <input
    type="file"
    accept="image/*"
    className="w-full"
  />

  <button type="submit">
    Submit
  </button>
</form>

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
