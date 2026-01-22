"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AiScanPage() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runScan = async () => {
    if (!image) return;

    try {
      setLoading(true);
      setError(null);

      const fileName = `scan-${Date.now()}.jpg`;

      // 1️⃣ Upload image
      const { data, error: uploadError } = await supabase.storage
        .from("vehicle-images")
        .upload(fileName, image);

      if (uploadError || !data) {
        throw new Error("Image upload failed");
      }

      // 2️⃣ Get public URL
      const imageUrl = supabase.storage
        .from("vehicle-images")
        .getPublicUrl(data.path).data.publicUrl;

      // 3️⃣ Get user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 4️⃣ Call AI scan API
      const res = await fetch("/api/ai/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          userId: user?.id ?? null,
        }),
      });

      if (!res.ok) {
        throw new Error("AI scan failed");
      }

      const scanResult = await res.json();
      setResult(scanResult);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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

      <br />

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
          cursor: "pointer",
        }}
      >
        {loading ? "Scanning…" : "Scan Vehicle"}
      </button>

      {error && (
        <p style={{ marginTop: 16, color: "red" }}>
          {error}
        </p>
      )}

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
          <p>
            <strong>Confidence:</strong>{" "}
            {(result.confidence * 100).toFixed(0)}%
          </p>

          <h4 style={{ marginTop: 16 }}>Maintenance Tips</h4>
          <ul>
            {result.tips?.map((t: string, i: number) => (
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
              cursor: "pointer",
            }}
          >
            Unlock Full Report ($2)
          </button>
        </div>
      )}
    </main>
  );
}
