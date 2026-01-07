"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SellForm() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !image) {
      alert("You must be logged in and select an image");
      setLoading(false);
      return;
    }

    const fileName = `${user.id}-${Date.now()}`;

    const { error: uploadError } = await supabase.storage
      .from("part-images")
      .upload(fileName, image);

    if (uploadError) {
      alert("Image upload failed");
      setLoading(false);
      return;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/part-images/${fileName}`;

    const { error: insertError } = await supabase.from("parts").insert({
      title,
      user_id: user.id,
      image_url: imageUrl,
    });

    if (insertError) {
      alert("Failed to save part");
    } else {
      alert("Part posted!");
      setTitle("");
      setImage(null);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="border p-2 w-full"
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

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Posting..." : "Post Part"}
      </button>
    </form>
  );
}
