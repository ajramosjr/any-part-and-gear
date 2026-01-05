import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PageProps = {
  params: { partId: string };
};

export default async function PartPage({ params }: PageProps) {
  const { data: part } = await supabase
    .from("parts")
    .select("*")
    .eq("id", Number(params.partId))
    .single();

  if (!part) notFound();

  return (
    <main style={{ padding: 40 }}>
      <Link href={`/browse/${listing.id}`}>
  {listing.title}
</Link>

      <h1>{part.title}</h1>
      {part.description && <p>{part.description}</p>}
      {part.category && (
        <p>
          <strong>Category:</strong> {part.category}
        </p>
      )}
    </main>
  );
}
