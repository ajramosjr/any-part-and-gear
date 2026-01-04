import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PartPage({
  params,
}: {
  params: { partId: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  const { data: part } = await supabase
    .from("parts") // ✅ correct table
    .select("*")
    .eq("id", Number(params.partId)) // ✅ int8 → Number
    .single();

  if (!part) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Link href="/browse" className="underline">
        ← Back to Browse
      </Link>

      <h1 className="text-3xl font-bold mt-4">{part.title}</h1>

      {part.description && (
        <p className="mt-4 text-muted-foreground">
          {part.description}
        </p>
      )}
    </div>
  );
}
