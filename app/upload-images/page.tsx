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
  const scanVehicle = async (imageUrl: string) => {
  const res = await fetch("/api/vehicle-scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error("Scan failed");
  }

  return data;
};
  const [vehicle, setVehicle] = useState<VehicleScanResult>({});
const [loadingScan, setLoadingScan] = useState(false);

setLoadingScan(true);

const result = await scanVehicle(publicUrl);

setVehicle({
  year: result.vehicle.year,
  make: result.vehicle.make,
  model: result.vehicle.model,
  trim: result.vehicle.trim,
  bodyType: result.vehicle.bodyType,
  confidence: result.confidence,
});

setLoadingScan(false);
  <input
  type="text"
  value={vehicle.make || ""}
  onChange={(e) =>
    setVehicle({ ...vehicle, make: e.target.value })
  }
/>

<input
  type="text"
  value={vehicle.model || ""}
  onChange={(e) =>
    setVehicle({ ...vehicle, model: e.target.value })
  }
/>

<input
  type="number"
  value={vehicle.year || ""}
  onChange={(e) =>
    setVehicle({ ...vehicle, year: Number(e.target.value) })
  }
/>
{vehicle.confidence && (
  <p className="text-sm text-gray-500">
    AI confidence: {Math.round(vehicle.confidence * 100)}%
  </p>
)}
typ
  {vehicle.confidence && vehicle.confidence < 0.7 && (
  <p className="text-yellow-500 text-sm">
    Please verify details before posting.
  </p>
)}
e VehicleScanResult = {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  bodyType?: string;
  confidence?: number;
};
  await supabase.from("parts").insert({
  make: vehicle.make,
  model: vehicle.model,
  year: vehicle.year,
  trim: vehicle.trim,
  body_type: vehicle.bodyType,
  image_url: publicUrl,
});
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
<p className="text-xs text-gray-400">
  Vehicle details are AI-assisted and may require verification.
</p>
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
