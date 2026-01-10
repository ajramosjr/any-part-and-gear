"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
      ? Array.from(e.target.files)
      : [];

    setFiles(selectedFiles);

    const previewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(previewUrls);
  };

  const uploadImages = async () => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const filePath = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("part-images")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        continue;
      }

      const { data } = supabase.storage
        .from("part-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrls: string[] = [];

      if (files.length > 0) {
        imageUrls = await uploadImages();
      }

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
      setMessage("✅ Part listed successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong");
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

        {/* IMAGE PREVIEWS */}
        {previews.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Preview ${i + 1}`}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "2px solid #444",
                }}
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            background: "#8b5cf6",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
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

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #444",
  fontSize: 16,
};
