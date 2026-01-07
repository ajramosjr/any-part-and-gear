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

  const { data: parts, count, error } = await supabase
    .from("parts")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) console.error(error);

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

  return (
    <main style={{ padding: 24 }}>
      <h1>Browse Parts</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        {parts?.map((part) => (
          <Link
            key={part.id}
            href={`/browse/${part.id}`}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              borderRadius: 8,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h3>{part.title}</h3>
            <p>${part.price}</p>
            {part.image_url && (
              <img
                src={part.image_url}
                alt={part.title ?? ""}
                style={{ maxWidth: 200, marginTop: 8 }}
              />
            )}
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
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
