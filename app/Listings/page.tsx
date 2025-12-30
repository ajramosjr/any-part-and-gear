"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Part = {
  id: number;
  title: string;
  vehicle_type: string | null;
  trade: boolean | null;
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadListings() {
      const { data, error } = await supabase
        .from("parts")
        .select("*");

      if (error) {
        setError(error.message);
      } else {
        setListings(data ?? []);
      }

      setLoading(false);
    }

    loadListings();
  }, []);

  return (
    <main style={{ padding: "40px" }}>
      <h1>Listings</h1>

      {loading && <p>Loading listings...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && listings.length === 0 && (
        <p>No listings found.</p>
      )}

      <ul style={{ marginTop: "24px" }}>
        {listings.map((item) => (
          <li key={item.id} style={{ marginBottom: "16px" }}>
            <strong>{item.title}</strong>
            <div>Vehicle: {item.vehicle_type ?? "N/A"}</div>
            <div>
              Type: {item.trade ? "Trade" : "For Sale"}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
