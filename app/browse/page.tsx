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
    return <p>Loading parts...</p>;
  }

  return (
    <main>
      <h1>Browse Parts</h1>

      <div>
        {parts.map((part) => (
          <div key={part.id}>
            <h3>{part.title}</h3>
            <p>{part.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
