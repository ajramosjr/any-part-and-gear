"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SellForm() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // ✅ Get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in");
      setLoading(false);
      return;
    }

    // ✅ Insert part with owner
    const { error } = await supabase.from("parts").insert({
      title,
      user_id: user.id,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Part listed!");
      setTitle("");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Part title"
      />

      <button disabled={loading}>
        {loading ? "Posting..." : "Post Part"}
      </button>
    </form>
  );
}        
