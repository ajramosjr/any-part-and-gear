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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Part title"
        style={{ padding: "8px" }}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
