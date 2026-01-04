export const dynamicParams = true;

import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

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

  if (!part) {
    return {
      title: "Part not found",
      description: "This part does not exist.",
    };
  }

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
