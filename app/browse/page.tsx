"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: string;
  title: string;
  description: string;
  images: string[];
};

export default function BrowsePage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImages, setActiveImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data);
      }
      setLoading(false);
    };

    fetchParts();
  }, []);

  const openLightbox = (images: string[], index: number) => {
    setActiveImages(images);
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setActiveImages([]);
    setActiveIndex(0);
  };

  const nextImage = () => {
    setActiveIndex((i) =>
      i + 1 >= activeImages.length ? 0 : i + 1
    );
  };

  const prevImage = () => {
    setActiveIndex((i) =>
      i - 1 < 0 ? activeImages.length - 1 : i - 1
    );
  };

  if (loading) {
    return <p style={{ padding: 40 }}>Loading parts…</p>;
  }

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ color: "#fff", marginBottom: 30 }}>
        Browse Parts
      </h1>

      <div style={grid}>
        {parts.map((part) => (
          <div key={part.id} style={card}>
            {part.images?.length > 0 && (
              <img
                src={part.images[0]}
                alt={part.title}
                style={mainImage}
                onClick={() =>
                  openLightbox(part.images, 0)
                }
              />
            )}

            <h3 style={title}>{part.title}</h3>
            <p style={description}>{part.description}</p>

            {part.images?.length > 1 && (
              <div style={thumbRow}>
                {part.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    style={thumb}
                    onClick={() =>
                      openLightbox(part.images, i)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div style={overlay} onClick={closeLightbox}>
          <button style={closeBtn}>✕</button>

          <button
            style={{ ...navBtn, left: 20 }}
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            ‹
          </button>

          <img
            src={activeImages[activeIndex]}
            style={lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            style={{ ...navBtn, right: 20 }}
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}

/* STYLES */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 24,
};

const card = {
  background: "#111",
  padding: 16,
  borderRadius: 12,
};

const mainImage = {
  width: "100%",
  height: 180,
  objectFit: "cover" as const,
  borderRadius: 10,
  cursor: "pointer",
};

const title = {
  color: "#fff",
  marginTop: 12,
};

const description = {
  color: "#bbb",
  fontSize: 14,
};

const thumbRow = {
  display: "flex",
  gap: 8,
  marginTop: 10,
};

const thumb = {
  width: 50,
  height: 50,
  objectFit: "cover" as const,
  borderRadius: 6,
  cursor: "pointer",
  border: "2px solid #333",
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const lightboxImage = {
  maxWidth: "90%",
  maxHeight: "90%",
  borderRadius: 12,
};

const navBtn = {
  position: "absolute" as const,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: 40,
  background: "none",
  border: "none",
  color: "#fff",
  cursor: "pointer",
};

const closeBtn = {
  position: "absolute" as const,
  top: 20,
  right: 20,
  fontSize: 30,
  background: "none",
  border: "none",
  color: "#fff",
  cursor: "pointer",
};
