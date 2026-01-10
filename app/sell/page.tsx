"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
      ? Array.from(e.target.files)
      : [];

    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;

    const newFiles = [...files];
    const newPreviews = [...previews];

    const [movedFile] = newFiles.splice(dragIndex, 1);
    const [movedPreview] = newPreviews.splice(dragIndex, 1);

    newFiles.splice(index, 0, movedFile);
    newPreviews.splice(index, 0, movedPreview);

    setFiles(newFiles);
    setPreviews(newPreviews);
    setDragIndex(null);
  };

  const uploadImages = async () => {
    const urls: string[] = [];

    for (const file of files) {
      const path = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("part-images")
        .upload(path, file);

      if (error) {
        console.error(error);
        continue;
      }

      const { data } = supabase.storage
        .from("part-images")
        .getPublicUrl(path);

      urls.push(data.publicUrl);
    }

    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const imageUrls = files.length ? await uploadImages() : [];

      const { error } = await supabase.from("parts").insert({
        title,
        description,
        images: imageUrls,
      });

      if (error) throw error;

      setTitle("");
      setDescription("");
      setFiles([]);
      setPreviews([]);
      setMessage("✅ Part listed successfully");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to post part");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ color: "#fff", marginBottom: 20 }}>
        Sell a Part
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Part title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          style={inputStyle}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ marginBottom: 16 }}
        />

        {/* DRAGGABLE PREVIEWS */}
        {previews.length > 0 && (
          <div style={previewGrid}>
            {previews.map((src, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(i)}
                style={previewItem}
              >
                <img src={src} alt="" style={previewImage} />
                <small style={{ color: "#aaa" }}>
                  Drag to reorder
                </small>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Posting..." : "Post Part"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 20, color: "#fff" }}>
          {message}
        </p>
      )}
    </main>
  );
}

/* STYLES */

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #444",
  fontSize: 16,
};

const previewGrid = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap" as const,
  marginBottom: 20,
};

const previewItem = {
  width: 90,
  textAlign: "center" as const,
  cursor: "grab",
};

const previewImage = {
  width: 90,
  height: 90,
  objectFit: "cover" as const,
  borderRadius: 8,
  border: "2px solid #444",
};

const buttonStyle = {
  width: "100%",
  padding: 14,
  background: "#8b5cf6",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
};
