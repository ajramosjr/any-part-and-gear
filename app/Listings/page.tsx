"use client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ListingsPage() {
  const { data: listings, error } = await supabase
    .from("listings")
    .select("*");

  if (!supabase) return;

const { data } = await supabase.from("parts").select("*");

  return (
    <main style={{ padding: "40px" }}>
      <h1>Listings</h1>

      {listings.length === 0 && <p>No listings found.</p>}

      <ul style={{ marginTop: "24px" }}>
        {listings.map((item) => (
          <li key={item.id} style={{ marginBottom: "16px" }}>
            <strong>{item.part_name}</strong>
            <div>Vehicle: {item.vehicle_type}</div>
            <div>Type: {item.listing_type}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
