"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AiScanPage() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
    const runScan = async () => {
  if (!image) return;
  setLoading(true);

  // Upload image to Supabase storage first
  const { data } = await supabase.storage
    .from("vehicle-images")
    .upload(`scan-${Date.now()}.jpg`, image);

  const imageUrl = supabase.storage
    .from("vehicle-images")
    .getPublicUrl(data!.path).data.publicUrl;

  const res = await fetch("/api/ai/scan", {
    method: "POST",
    body: JSON.stringify({
      imageUrl,
      userId: (await supabase.auth.getUser()).data.user?.id,
    }),
  });

  const result = await res.json();
  setResult(result);
  setLoading(false);
};

  return (
    <main style={{ padding: 40, maxWidth: 700 }}>
      <h1>🚗 AI Vehicle Scan</h1>

      <p style={{ color: "#555" }}>
        Upload a photo of your vehicle. We'll identify it and suggest compatible parts.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <button
        onClick={runScan}
        disabled={loading}
        style={{
          marginTop: 16,
          padding: "10px 16px",
          borderRadius: 8,
          background: "#0f172a",
          color: "#fff",
          border: "none",
        }}
      >
        {loading ? "Scanning…" : "Scan Vehicle"}
      </button>

      {result && (
        <div
          style={{
            marginTop: 32,
            background: "#fff",
            padding: 20,
            borderRadius: 14,
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h3>Scan Result</h3>
          <p><strong>Make:</strong> {result.make}</p>
          <p><strong>Model:</strong> {result.model}</p>
          <p><strong>Year:</strong> {result.year}</p>
          <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(0)}%</p>

          <h4 style={{ marginTop: 16 }}>Maintenance Tips</h4>
          <ul>
            {result.tips.map((t: string, i: number) => (
              <li key={i}>{t}</li>
            ))}
          </ul>

          <button
            style={{
              marginTop: 16,
              background: "#16a34a",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
            }}
          >
            Unlock Full Report ($2)
          </button>
        </div>
      )}
    </main>
  );
}
