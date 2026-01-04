export const dynamicParams = true;

import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";

/* SEO metadata */
export async function generateMetadata({
  params,
}: {
  params: { partId: string };
}) {
  const { data: part } = await supabase
    .from("parts")
    .select("title, description")
    .eq("id", Number(params.partId))
    .single();
  
const { data: relatedParts } = await supabase
  .from("parts")
  .select("id, title, image_url")
  .eq("category", part.category)
  .neq("id", part.id)
  .limit(4);
  
  if (!part) {
    return {
      title: "Part not found",
      description: "This part does not exist.",
    };
  }
{relatedParts && relatedParts.length > 0 && (
  <section style={{ marginTop: 60 }}>
    <h2>Related Parts</h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 16,
        marginTop: 20,
      }}
    >
      {relatedParts.map((rp) => (
        <a
          key={rp.id}
          href={`/browse/${rp.id}`}
          style={{
            border: "1px solid #333",
            padding: 12,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          {rp.image_url && (
            <img
              src={rp.image_url}
              alt={rp.title}
              style={{ width: "100%", maxHeight: 120, objectFit: "cover" }}
            />
          )}
          <p style={{ marginTop: 8 }}>{rp.title}</p>
        </a>
      ))}
    </div>
  </section>
)}
  return {
    title: part.title,
    description: part.description ?? "Vehicle part listing",
  };
}

/* Page */
export default async function PartPage({
  params,
}: {
  params: { partId: string };
}) {
  const { data: part } = await supabase
    .from("parts")
    .select("*")
    .eq("id", Number(params.partId))
    .single();

  if (!part) {
    notFound();
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
return (
  <main style={{ padding: 40 }}>
    <Breadcrumbs
      category={part.category}
      title={part.title}
    />

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
