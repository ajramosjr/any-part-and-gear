"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function PartPage() {
  const params = useParams();
  const partId = params.partId as string;

  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPart() {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", partId)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setPart(data);
      }

      setLoading(false);
    }

    if (partId) {
      fetchPart();
    }
  }, [partId]);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  if (error) {
    return (
      <p style={{ padding: 20, color: "red" }}>
        Error: {error}
      </p>
    );
  }

  if (!part) {
    return <p style={{ padding: 20 }}>Part not found.</p>;
  }

  return (
    <main style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>{part.title}</h1>

      <pre
        style={{
          marginTop: 20,
          background: "#f5f5f5",
          padding: 16,
          borderRadius: 6,
          overflowX: "auto",
        }}
      >
        {JSON.stringify(part, null, 2)}
      </pre>
    </main>
  );
}
