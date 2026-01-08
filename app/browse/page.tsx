import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BrowsePage() {
  const { data: parts, error } = await supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Error loading parts</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Browse Parts</h1>

      <ul>
        {parts?.map((part) => (
          <li key={part.id}>
            <Link href={`/parts/${part.id}`}>
              {part.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
