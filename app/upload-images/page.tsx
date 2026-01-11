"use client";

import { useState } from "react";

export default function UploadImagesPage() {
  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    year: "",
    bodyType: "",
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Upload Images</h1>

      <input
        type="text"
        placeholder="Vehicle model"
        value={vehicle.model || ""}
        onChange={(e) =>
          setVehicle({ ...vehicle, model: e.target.value })
        }
      />
    </div>
  );
}
