"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  description: string;
};

export default function BrowsePage() {
  const [parts, setParts] = useState<Part[]>([]);
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
    return <p style={{ padding: 20 }}>Loading parts...</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Browse Parts</h1>

      {parts.length === 0 && <p>No parts listed yet.</p>}

      {parts.map((part) => (
        <a
          key={part.id}
          href={`/browse/${part.id}`}
          style={styles.link}
        >
          <div style={styles.card}>
            <h3 style={styles.title}>{part.title}</h3>
            <p style={styles.description}>{part.description}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  heading: {
    marginBottom: "20px",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  card: {
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
    backgroundColor: "#111",
  },
  title: {
    margin: "0 0 8px 0",
  },
  description: {
    margin: 0,
    opacity: 0.8,
  },
};
