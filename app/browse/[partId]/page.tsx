  import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

export async function generateStaticParams() {
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { data: part } = await supabase
    .from("parts")
    .select("title, description")
    .eq("id", Number(params.id))
    .single();

if (error || !part) {
  notFound();
}

  return {
    title: `${part.title} | Any-Part & Gear`,
    description:
      part.description ??
      "Find quality auto parts and gear on Any-Part & Gear.",
  };
} 
  const { data: parts } = await supabase
    .from("parts")
    .select("id");

  if (!parts) return [];

  return parts.map((part) => ({
    id: part.id.toString(),
  }));
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
