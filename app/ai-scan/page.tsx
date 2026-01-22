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

    // MOCK AI RESULT (replace later)
    const fakeResult = {
      make: "Ford",
      model: "F-150",
      year: 2018,
      confidence: 0.86,
      tips: [
        "Check transmission service intervals",
        "Brake pads commonly replaced at 50k miles",
      ],
    };

    setTimeout(async () => {
      setResult(fakeResult);

      await supabase.from("vehicle_scans").insert({
        image_url: "uploaded_image_url",
        make: fakeResult.make,
        model: fakeResult.model,
        year: fakeResult.year,
        confidence: fakeResult.confidence,
      });

      setLoading(false);
    }, 1500);
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
