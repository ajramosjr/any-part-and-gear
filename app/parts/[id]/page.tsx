import { createClient } from "@supabase/supabase-js";

export default async function PartPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: part } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.id)
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

      <p>{part.description}</p>
      <p><strong>${part.price}</strong></p>
    </main>
  );
}
