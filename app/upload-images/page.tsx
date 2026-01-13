"use client";

import { useState } from "react";

export default function UploadImagesPage() {
  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    year: "",
    bodyType: "",
  });

  const [images, setImages] = useState<File[]>([]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 500 }}>
      <h1>Upload Vehicle Images</h1>

      <input
        type="text"
        placeholder="Make"
        value={vehicle.make}
        onChange={(e) =>
          setVehicle({ ...vehicle, make: e.target.value })
        }
      />

      <br /><br />

      <input
        type="text"
        placeholder="Model"
        value={vehicle.model}
        onChange={(e) =>
          setVehicle({ ...vehicle, model: e.target.value })
        }
      />

      <br /><br />

      <input
        type="text"
        placeholder="Year"
        value={vehicle.year}
        onChange={(e) =>
          setVehicle({ ...vehicle, year: e.target.value })
        }
      />

      <br /><br />

      <input
        type="text"
        placeholder="Body Type"
        value={vehicle.bodyType}
        onChange={(e) =>
          setVehicle({ ...vehicle, bodyType: e.target.value })
        }
      />

      <br /><br />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />

      <p style={{ marginTop: 10 }}>
        {images.length} image(s) selected
      </p>
    </div>
  );
}
