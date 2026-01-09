"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BrowsePage() {
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div style={styles.page}>
        <p style={styles.loading}>Loading parts…</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Browse Parts</h1>

      {parts.length === 0 && (
        <p style={styles.empty}>No parts available yet.</p>
      )}

      <div style={styles.grid}>
        {parts.map((part) => (
      <a
  href={`/browse/${part.id}`}
  key={part.id}
  style={{ textDecoration: "none" }}
>
        </div>
</a>
  <div style={styles.card}>    
            <h3 style={styles.title}>{part.title}</h3>
            <p style={styles.description}>{part.description}</p>
            <p style={styles.date}>
              Listed {new Date(part.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    backgroundColor: "#f5f7fa",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
  },
  heading: {
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "20px",
    color: "#111827",
  },
  loading: {
    fontSize: "18px",
    color: "#374151",
  },
  empty: {
    fontSize: "16px",
    color: "#6b7280",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "16px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  title: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "8px",
    color: "#1f2937",
  },
  description: {
    fontSize: "14px",
    color: "#4b5563",
    marginBottom: "12px",
  },
  date: {
    fontSize: "12px",
    color: "#9ca3af",
  },
};
