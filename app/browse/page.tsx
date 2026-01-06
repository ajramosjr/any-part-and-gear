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
      
  <ul>
  {filtered?.map((part) => (
    <li key={part.id}>
      <Link href={`/browse/${part.id}`}>{part.title}</Link>
    </li>
  ))}
    {parts.map((part) => (
  <div key={part.id} style={{ marginBottom: 20 }}>
    {part.image_url && (
      <img
        src={part.image_url}
        alt={part.title}
        width={150}
        style={{ borderRadius: 8 }}
      />
    )}

    <Link href={`/browse/${part.id}`}>
      {part.title}
    </Link>
  </div>
))}
</ul>
      
    </main>
  );
}
