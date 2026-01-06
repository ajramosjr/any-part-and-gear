import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PartPage({
  params,
}: {
  params: { partId: string };
}) {
  const partId = params.partId; // ✅ KEEP AS STRING

  // optional safety check (UUIDs contain hyphens)
  if (!partId || partId.length < 10) {
    notFound();
  }
const {
  data: { user },
} = await supabase.auth.getUser();

await supabase.from("parts").insert({
  title,
  description,
  category,
  user_id: user!.id,
});
  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId) // ✅ UUID comparison
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
