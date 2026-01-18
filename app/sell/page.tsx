"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const submit = async () => {
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Not authenticated");
      return;
    }

    let imageUrl: string | null = null;

    // 🔹 Upload image if selected
    if (image) {
      const fileName = `${user.id}-${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("part-images")
        .upload(fileName, image);

      if (uploadError) {
        setMessage(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("part-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    // 🔹 Insert listing
    const { error } = await supabase.from("parts").insert({
      user_id: user.id,
      title,
      description,
      price: price ? Number(price) : null,
      image: imageUrl,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setMessage("✅ Part listed successfully!");
    }
  };

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 500 }}>
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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <br /><br />

        <button onClick={submit}>Post Listing</button>

        {message && <p style={{ marginTop: 12 }}>{message}</p>}
      </main>
    </RequireAuth>
  );
}
