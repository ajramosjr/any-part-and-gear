"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SellPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const uploadImages = async (files: File[]) => {
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
        imageUrls = await uploadImages(files);
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
      setMessage("Part listed successfully ✅");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Sell a Part</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Part title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setFiles(e.target.files ? Array.from(e.target.files) : [])
          }
          style={{ marginBottom: 16 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            background: "#111",
            color: "#fff",
            borderRadius: 6,
          }}
        >
          {loading ? "Posting..." : "Post Part"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 16, fontWeight: "bold" }}>{message}</p>
      )}
    </main>
  );
}
