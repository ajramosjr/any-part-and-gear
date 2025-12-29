"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
export default function SellPage() {
  const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(e.currentTarget);

  const { error } = await supabase.from("parts").insert([
    {
      title: formData.get("title"),
      vehicle_type: formData.get("vehicle_type"),
      trade: formData.get("trade_type") === "trade",
    },
  ]);

  if (error) {
    setMessage(error.message);
  } else {
    setMessage("✅ Part listed successfully!");
    e.currentTarget.reset();
  }

  setLoading(false);
}
  return (
    <main style={{ padding: "40px", maxWidth: "600px" }}>
      <h1>Sell or Trade Parts</h1>
      <p>List your parts for sale or trade with other users.</p>

      <form
  onSubmit={handleSubmit}
  style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}
><input
          <input
  name="title"
  type="text"
  placeholder="Part name (e.g. 2018 F150 Headlight)"
  required
  style={{ padding: "12px" }}
/>

        <select required style={{ padding: "12px" }}>
          <select name="vehicle_type" required style={{ padding: "12px" }}>
          <option value="car">Car</option>
          <option value="truck">Truck</option>
          <option value="boat">Boat</option>
          <option value="motorcycle">Motorcycle</option>
        </select>

        <select required style={{ padding: "12px" }}>
        <select name="trade_type" required style={{ padding: "12px" }}>
          <option value="sell">Sell</option>
          <option value="trade">Trade</option>
        </select>

        <textarea
          placeholder="Describe the part, condition, compatibility, etc."
          rows={4}
          style={{ padding: "12px" }}
        />

        <button
          type="submit"
          style={{
            padding: "14px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Submit Listing
        </button>
      </form>
    </main>
  );
}<button type="submit" disabled={loading}>
  {loading ? "Submitting..." : "Submit Part"}
</button>

{message && <p>{message}</p>}
