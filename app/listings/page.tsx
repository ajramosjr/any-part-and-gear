"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setListings(data ?? []);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <main style={{ padding: 40 }}>Loading…</main>;
  }

  if (error) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Error loading listings</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Listings</h1>

      {listings.length === 0 && <p>No listings found.</p>}

      <ul style={{ marginTop: 24 }}>
        {listings.map((item) => (
          <li key={item.id} style={{ marginBottom: 16 }}>
            <strong>{item.title}</strong>
          </li>
        ))}
      </ul>
    </main>
  );
}
