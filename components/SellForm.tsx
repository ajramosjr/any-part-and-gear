"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

export default function SellForm() {
  const supabase = createClient(); // ✅ create client here
  const [title, setTitle] = useState("");

  async function handleSubmit() {
    const { error } = await supabase
      .from("listings")
      .insert({ title });

    if (error) {
      console.error(error);
      alert("Failed to submit listing");
    } else {
      alert("Listing submitted!");
      setTitle("");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Listing title"
        style={{
          padding: "8px",
          marginRight: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
