"use client";

import { useState } from "react";
import { createPart } from "../actions/createPart";

export default function SellPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createPart(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setMessage("✅ Part listed successfully!");
      e.currentTarget.reset();
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: "40px", maxWidth: "600px" }}>
      <h1>Sell or Trade Parts</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <input
          name="title"
          type="text"
          placeholder="Part name (e.g. 2018 Ford Headlight)"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Part"}
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
