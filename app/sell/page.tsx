"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";

export default function SellPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("parts").insert({
      title,
      price: Number(price),
      description,
      user_id: user.id,
    });

    setLoading(false);

    if (!error) {
      setTitle("");
      setPrice("");
      setDescription("");
      router.push("/my-listings");
    }
  };

  return (
    <RequireAuth>
      <div style={{ maxWidth: 600, margin: "40px auto" }}>
        <h1>Sell a Part</h1>

        <form onSubmit={submitListing}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Posting..." : "Post Listing"}
          </button>
        </form>
      </div>
    </RequireAuth>
  );
}
