"use client";

import { useState } from "react";

export default function SellClient() {
  const [title, setTitle] = useState("");

  return (
    <form
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "400px",
      }}
    >
      <input
        placeholder="Part title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #444",
          background: "#111",
          color: "#fff",
        }}
      />

      <button
        type="submit"
        style={{
          padding: "10px",
          borderRadius: "6px",
          background: "#22c55e",
          color: "#000",
          fontWeight: "bold",
        }}
      >
        Submit
      </button>
    </form>
  );
}
