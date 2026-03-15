"use client";

import { useState } from "react";

export default function ScanPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState<any>(null);

  async function scanVehicle() {
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl,
        userId: "demo-user",
      }),
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Scan Your Vehicle
      </h1>

      <input
        type="text"
        placeholder="Paste image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="border p-3 w-full mb-4"
      />

      <button
        onClick={scanVehicle}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Scan Vehicle
      </button>

      {result && (
        <div className="mt-8 border p-6 rounded-xl">

          <h2 className="text-xl font-semibold mb-4">
            AI Scan Result
          </h2>

          <p><strong>Vehicle:</strong> {result.vehicle}</p>
          <p><strong>Part:</strong> {result.part}</p>
          <p><strong>Condition:</strong> {result.condition}</p>
          <p><strong>Confidence:</strong> {Math.round(result.confidence * 100)}%</p>

        </div>
      )}

    </main>
  );
}
