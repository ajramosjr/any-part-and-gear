import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PartPage({
  params,
}: {
  params: { partId: string };
}) {
  const partId = params.partId; // UUID — DO NOT convert to Number

  const { data: part, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", partId)
    .single();

  if (error || !part) {
    notFound();
  }

  return (
    <main style={{ padding: 40 }}>
      <Link href="/browse">← Back to Browse</Link>

      <h1>{part.part_name}</h1>
      <p>{part.vehicle_type}</p>
    </main>
  );
}
