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

  // 🔒 Guard against invalid URLs
  if (Number.isNaN(partId)) {
    notFound();
  }

  const { data: part, error } = await supabase
    .from("parts")        // ✅ SAME table as browse
    .select("*")
    .eq("id", partId)     // ✅ numeric ID
    .single();

  if (error || !part) {
    notFound();
  }

  return (
    <main style={{ padding: 40 }}>
      <Link href="/browse">← Back to Browse</Link>

      <h1>{part.title}</h1>
      <p>{part.description}</p>
      <p><strong>Category:</strong> {part.category}</p>
    </main>
  );
}
