"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function PartDetailPage() {
  const params = useParams();
  const partId = params?.id as string; // ⚠️ important note below

  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partId) return;

    let mounted = true;

    const fetchPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", partId)
        .single();

      if (!error && mounted) {
        setPart(data);
      }

      if (mounted) {
        setLoading(false);
      }
    };

    fetchPart();

    return () => {
      mounted = false;
    };
  }, [partId]);

  if (loading) {
    return <p style={{ padding: 24 }}>Loading part…</p>;
  }

  if (!part) {
    return <p style={{ padding: 24 }}>Part not found</p>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>{part.title}</h1>
        <p style={styles.description}>{part.description}</p>
        <p style={styles.meta}>
          Listed on {new Date(part.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    backgroundColor: "#f5f7fa",
    fontFamily: "system-ui",
  },
  card: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "26px",
    fontWeight: 700,
    marginBottom: "12px",
  },
  description: {
    fontSize: "16px",
    color: "#374151",
    marginBottom: "16px",
  },
  meta: {
    fontSize: "13px",
    color: "#6b7280",
  },
};
