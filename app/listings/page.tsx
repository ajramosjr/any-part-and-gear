import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ListingsPage() {
  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Error loading listings</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  const listings = data ?? [];

  return (
    <main style={{ padding: "40px" }}>
      <h1>Listings</h1>

      {listings.length === 0 && <p>No listings found.</p>}

      <ul style={{ marginTop: "24px" }}>
        {listings.map((item) => (
          <li key={item.id} style={{ marginBottom: "16px" }}>
            <strong>{item.title}</strong>
          </li>
        ))}
      </ul>
    </main>
  );
}
