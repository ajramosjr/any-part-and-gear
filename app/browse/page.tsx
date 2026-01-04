export const dynamic = "force-dynamic";

import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category ?? null;

  const { data: parts, error } = await supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to load parts");
  }

  const filtered = category
    ? parts?.filter((part) => part.category === category)
    : parts;

  return (
    <main style={{ padding: 40 }}>
      <h1>Browse Parts</h1>

      {filtered?.map((part) => (
        <Link key={part.id} href={`/browse/${part.id}`}>
          <div style={{ marginBottom: 12 }}>
            <strong>{part.title}</strong>
          </div>
        </Link>
      ))}
    </main>
  );
}
