import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// 🚨 REQUIRED for Supabase + dynamic routes
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PageProps = {
  params: {
    partId: string;
  };
};

export default async function PartPage({ params }: PageProps) {
  const { partId } = params;

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId)
    .single();

  if (error || !part) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Part not found</h1>
        <Link href="/browse">← Back to Browse</Link>
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
