"use client";

import React from "react";

type Part = {
  id: string;
  title: string;
  description?: string;
};

type PartImage = {
  id: string;
  url: string;
  part_title: string;
};

export default function BrowsePage() {
  // 🔧 Mock data (replace later with API data)
  const parts: Part[] = [
    { id: "1", title: "Alternator" },
    { id: "2", title: "Brake Caliper" },
    { id: "3", title: "Exhaust Manifold" },
  ];

  const images: PartImage[] = [
    {
      id: "img1",
      url: "https://via.placeholder.com/150",
      part_title: "Alternator",
    },
    {
      id: "img2",
      url: "https://via.placeholder.com/150",
      part_title: "Brake Caliper",
    },
    {
      id: "img3",
      url: "https://via.placeholder.com/150",
      part_title: "Exhaust Manifold",
    },
  ];

  return (
    <main style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Browse Parts
      </h1>

      {parts.map((part) => (
        <div
          key={part.id}
          style={{
            marginBottom: "32px",
            paddingBottom: "16px",
            borderBottom: "1px solid #333",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
            {part.title}
          </h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
              overflowX: "auto",
            }}
          >
            {images
              .filter((img) => img.part_title === part.title)
              .map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={part.title}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #444",
                  }}
                />
              ))}
          </div>
        </div>
      ))}
    </main>
  );
}
