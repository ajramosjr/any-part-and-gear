"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NewPartPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [platform, setPlatform] = useState("Automotive");
  const [category, setCategory] = useState("Other");
  const [tradeAvailable, setTradeAvailable] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("part-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Image upload failed");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("part-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("parts").insert({
      title,
      description,
      price: Number(price),
      platform,
      category,
      trade_available: tradeAvailable,
      image_url: imageUrl,
    });

    if (!error) {
      router.push("/parts");
    }

    setLoading(false);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Post a Part</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option>Automotive</option>
          <option>Marine</option>
          <option>RC</option>
          <option>Universal</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option>Brakes</option>
          <option>Engine</option>
          <option>Suspension</option>
          <option>Electrical</option>
          <option>Body</option>
          <option>Interior</option>
          <option>Drivetrain</option>
          <option>Other</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={tradeAvailable}
            onChange={(e) => setTradeAvailable(e.target.checked)}
          />
          Trade available
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Posting..." : "Post Part"}
        </button>
      </form>
    </main>
  );
}
