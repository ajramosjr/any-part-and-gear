import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BrowsePage() {
  const { data: parts } = await supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: 40 }}>
      <h1>Browse Parts</h1>

      <ul style={{ marginTop: 20 }}>
        {parts?.map((part) => (
          <li key={part.id} style={{ marginBottom: 16 }}>
            <Link href={`/parts/${part.id}`}>
              <strong>{part.title}</strong>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
