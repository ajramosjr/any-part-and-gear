import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PartPage({
  params,
}: {
  params: { partId: string };
}) {
  const partId = Number(params.partId);

  // 🚨 Guard: invalid ID in URL
  if (Number.isNaN(partId)) {
    notFound();
  }

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId)
    .single();

  if (error || !part) {
    notFound();
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>{part.title}</h1>

      {part.description && <p>{part.description}</p>}

      <Link href="/browse">← Back to Browse</Link>
    </main>
  );
}
