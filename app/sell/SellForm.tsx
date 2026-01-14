"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

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

      {error && (
        <p style={{ color: "red", marginBottom: 16 }}>{error}</p>
      )}

      {success && (
        <p style={{ color: "green", marginBottom: 16 }}>
          Listing created successfully!
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 8,
                marginTop: 4,
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: 8,
                marginTop: 4,
              }}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          {loading ? "Posting…" : "Post Listing"}
        </button>
      </form>
    </main>
  );
}
