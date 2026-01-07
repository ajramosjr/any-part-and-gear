import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const supabase = createSupabaseServerClient();

  const page = Number(searchParams.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: parts, count } = await supabase
    .from("parts")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

  return (
    <main style={{ padding: 24 }}>
      <h1>Browse Parts</h1>

      <div style={{ display: "grid", gap: 16 }}>
        {parts?.map((part) => (
          <Link key={part.id} href={`/browse/${part.id}`}>
            <h3>{part.title}</h3>
            <p>${part.price}</p>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        {page > 1 && <Link href={`/browse?page=${page - 1}`}>← Prev</Link>}
        {page < totalPages && (
          <Link href={`/browse?page=${page + 1}`} style={{ marginLeft: 16 }}>
            Next →
          </Link>
        )}
      </div>
    </main>
  );
}
