"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function AiScanPage() {

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const supabase = createClient();
  const handleScan = async () => {
    if (!image) return;

    setLoading(true);

    // example placeholder — replace with your real logic
    const { data, error } = await supabase
      .from("ai_scans")
      .insert({ status: "uploaded" })
      .select()
      .single();

    if (!error) {
      setResult("Scan submitted successfully");
    }

    setLoading(false);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Scan</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleScan}
        disabled={!image || loading}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        {loading ? "Scanning..." : "Scan"}
      </button>

      {result && <p className="mt-4 text-green-600">{result}</p>}
    </main>
  );
}
