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
    .eq("id", Number(params.id)) // ✅ REQUIRED
    .single();

  if (!part) {
    return <main style={{ padding: "40px" }}>Part not found</main>;
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>{part.title}</h1>

      {part.image_url && (
        <img
          src={part.image_url}
          alt={part.title}
          style={{ maxWidth: "400px", marginBottom: "20px" }}
        />
      )}

      {part.description && <p>{part.description}</p>}

      {part.price !== null && (
        <p>
          <strong>${part.price}</strong>
        </p>
      )}
    </main>
  );
}
