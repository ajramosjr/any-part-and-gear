"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseBrowser";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!imageFile) {
      alert("Please select an image");
      setLoading(false);
      return;
    }

    // 🔹 Upload image
    const ext = imageFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = `parts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("part-images") // ✅ matches your bucket
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error(uploadError);
      alert("Upload failed");
      setLoading(false);
      return;
    }

    const { data } = supabase.storage
      .from("part-images")
      .getPublicUrl(filePath);

    const imageUrl = data.publicUrl;

    console.log("IMAGE URL:", imageUrl);

    // ⛔️ Do NOT insert into parts table yet
    // We’ll do that safely next

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Part title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2"
      >
        {loading ? "Uploading..." : "Submit"}
      </button>
    </form>
  );
}
