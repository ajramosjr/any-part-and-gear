"use client";

import { useState } from "react";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload an image");
      return;
    }

    // Upload logic comes next (Step 2)
    console.log("Ready to upload:", imageFile);
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sell a Part</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Part title"
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full border rounded p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price (optional)"
          className="w-full border rounded p-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {/* IMAGE PREVIEW */}
        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm mb-2">Image preview:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded border"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Post Listing
        </button>
      </form>
    </div>
  );
}
