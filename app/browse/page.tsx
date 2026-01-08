import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// ⛔ prevents Next.js from running this at build time
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BrowsePage() {
  const { data: parts, error } = await supabase
    .from("parts")
    .select("id, name, price")
    .limit(20);

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Error loading parts</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Browse Parts</h1>

      <ul>
        {parts?.map((part) => (
          <li key={part.id}>
            <Link href={`/browse/${part.id}`}>
              {part.name} – ${part.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
