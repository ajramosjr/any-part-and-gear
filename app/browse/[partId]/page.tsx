import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PartPage({
  params,
}: {
  params: { partId: string };
}) {
  const partId = params.partId; // ✅ KEEP AS STRING (UUID)

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId) // ✅ UUID match
    .single();

  if (error || !part) {
    notFound();
  }

  return (
    <main style={{ padding: 40 }}>
      <Link href="/browse">← Back to Browse</Link>

      <h1>{part.title}</h1>
      <p>{part.description}</p>
      <p>
        <strong>Category:</strong> {part.category}
      </p>
    </main>
  );
}
