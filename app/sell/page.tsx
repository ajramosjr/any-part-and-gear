"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function SellPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // 1️⃣ Get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in");
      setLoading(false);
      return;
    }

    let imageUrl: string | null = null;

    // 2️⃣ Upload image (if exists)
    if (file) {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("part-images")
        .upload(filePath, file);

      if (uploadError) {
        alert("Image upload failed");
        setLoading(false);
        return;
      }

      // 3️⃣ Get PUBLIC URL ✅
      const { data } = supabase.storage
        .from("part-images")
        .getPublicUrl(filePath);

      imageUrl = data.publicUrl;
    }

    // 4️⃣ Insert part
    const { error } = await supabase.from("parts").insert({
      title,
      price: price ? Number(price) : null,
      description,
      image_url: imageUrl,
      user_id: user.id,
    });

    if (error) {
      alert("Failed to create listing");
      console.error(error);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/my-listings");
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sell a Part</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Posting..." : "Post Listing"}
        </button>
      </div>
    </main>
  );
}
