"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function UploadImagesPage() {
  const supabase = createClient();
  const [partTitle, setPartTitle] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  async function handleUpload() {
    if (!files || !partTitle) return;

    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}-${file.name}`;

      await supabase.storage
        .from("part-images")
        .upload(fileName, file);

      const { data } = supabase.storage
        .from("part-images")
        .getPublicUrl(fileName);

      await supabase.from("part_images").insert({
        part_title: partTitle,
        image_url: data.publicUrl,
      });
    }

    alert("Images uploaded!");
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Upload Images</h2>

      <input
        placeholder="Part title (must match listing)"
        value={partTitle}
        onChange={(e) => setPartTitle(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
      />

      <button
        onClick={handleUpload}
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#0a2540",
          color: "white",
          borderRadius: "6px",
        }}
      >
        Upload
      </button>
    </div>
  );
}
