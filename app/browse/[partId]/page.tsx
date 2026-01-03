export const dynamicParams = true;
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

/* 1️⃣ Static params */
export async function generateStaticParams() {
  const { data: parts } = await supabase
    .from("parts")
    .select("id");

  if (!parts) return [];

  return parts.map((part) => ({
    partId: part.id.toString(),
  }));
}

/* 2️⃣ SEO metadata */
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
    return { title: "Part not found" };
  }

  return {
    title: part.title,
    description: part.description ?? "Vehicle part listing",
  };
}

/* 3️⃣ Page component */
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
