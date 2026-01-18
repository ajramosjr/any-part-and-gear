"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("parts").insert({
      user_id: user.id,
      title,
      description,
      price,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setTitle("");
      setDescription("");
      setPrice("");
      setMessage("✅ Part listed!");
    }
  };

  return (
    <RequireAuth>
      <main style={{ padding: 40 }}>
        <h1>Sell a Part</h1>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <br /><br />

        <button onClick={submit}>Post Listing</button>

        {message && <p>{message}</p>}
      </main>
    </RequireAuth>
  );
}
