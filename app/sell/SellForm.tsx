"use client";

import { useState } from "react";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default function SellForm() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !image) return;

    const fileName = `${user.id}-${Date.now()}`;

    const { data, error } = await supabase.storage
      .from("part-images")
      .upload(fileName, image);

    if (error) {
      alert("Upload failed");
      return;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/part-images/${fileName}`;

    await supabase.from("parts").insert({
      title,
      user_id: user.id,
      image_url: imageUrl,
    });

    alert("Part posted!");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Part title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        required
      />

      <button type="submit">Post Part</button>
    </form>
  );
}
