export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";

export default async function HomePage() {
  const { data: parts, error } = await supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <p style={{ color: "red" }}>Error loading parts</p>;
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Any-Part & Gear</h1>

      <h2>Available Parts</h2>

      {parts.length === 0 && <p>No parts listed yet.</p>}

      <ul>
        {parts.map((part) => (
          <li key={part.id}>{part.title}</li>
        ))}
      </ul>
    </main>
  );
}
