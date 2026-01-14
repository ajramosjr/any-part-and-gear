"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseBrowser";

export default function SellForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to post a part.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("parts").insert({
      title,
      description,
      user_id: user.id,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTitle("");
      setDescription("");
    }

    setLoading(false);
  };

  return (
    <main style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <Link href="/" style={{ display: "block", marginBottom: 20 }}>
        ← Back Home
      </Link>

      <h1>Sell a Part</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Listing posted!</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />

        <button disabled={loading}>
          {loading ? "Posting..." : "Post Listing"}
        </button>
      </form>
    </main>
  );
}
