"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function SellForm() {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in to sell a part.");
      return;
    }

    const { error } = await supabase.from("parts").insert({
      title,
      description,
      user_id: user.id,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Part listed successfully!");
      setTitle("");
      setDescription("");
    }
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Sell a Part</h2>

      <input
        placeholder="Part title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={handleSubmit}>List Part</button>

      {message && <p>{message}</p>}
    </div>
  );
}
