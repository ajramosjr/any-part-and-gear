"use client";

import { useState } from "react";

export default function AIScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const scanVehicle = async () => {

    if (!file) {
      setResult("Please upload an image first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/vehicle-scan", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setLoading(false);

    if (data.error) {
      setResult("Scan failed");
    } else {
      setResult(JSON.stringify(data, null, 2));
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 text-center">

      <h1 className="text-3xl font-bold mb-6">AI Scan</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={scanVehicle}
        className="bg-black text-white px-6 py-2 ml-4 rounded"
      >
        {loading ? "Scanning..." : "Scan"}
      </button>

      <p className="mt-6 text-green-600">{result}</p>

    </div>
  );
}
