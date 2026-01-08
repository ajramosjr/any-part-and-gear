import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: {
    partId: string;
  };
};

export default async function PartPage({ params }: PageProps) {
  const { partId } = params;

  // ⛔ Create Supabase INSIDE the function (CRITICAL)
  const { createClient } = await import("@supabase/supabase-js");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId)
    .single();

  if (error || !part) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Part not found</h1>
        <Link href="/browse">← Back</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{part.name}</h1>
      <p>{part.description}</p>
      <p>
        <strong>Price:</strong> ${part.price}
      </p>

      <Link href="/browse">← Back to Browse</Link>
    </div>
  );
}
