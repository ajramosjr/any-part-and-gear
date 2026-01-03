import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function PartPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: part } = await supabase
    .from("parts")
    .select("*")
    .eq("id", Number(params.id))
    .single();

  if (!part) {
    return <div style={{ padding: 40 }}>Part not found</div>;
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>{part.title}</h1>

      {part.image_url && (
        <img
          src={part.image_url}
          alt={part.title}
          style={{ maxWidth: 300 }}
        />
      )}

      {part.price !== null && <p>Price: ${part.price}</p>}
      {part.description && <p>{part.description}</p>}
    </main>
  );
}
