"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

export default function SellForm() {
  const [title, setTitle] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await supabase.from("parts").insert({ title });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Part name"
      />
      <button type="submit">Sell</button>
    </form>
  );
}
