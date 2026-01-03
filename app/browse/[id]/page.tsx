import { supabase } from "@/lib/supabase";

export default async function PartPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: part } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.id)
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

      {part.price && <p>Price: ${part.price}</p>}
      {part.description && <p>{part.description}</p>}
    </main>
  );
}
