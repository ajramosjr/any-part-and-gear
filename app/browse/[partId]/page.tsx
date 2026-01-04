import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

/* ---------------- SEO ---------------- */
export async function generateMetadata({
  params,
}: {
  params: { partId: string };
}) {
  const { data: part } = await supabase
    .from("parts")
    .select("title, description")
    .eq("id", params.partId)
    .single();

  if (!part) return { title: "Part not found" };

  return {
    title: part.title,
    description: part.description ?? "Part listing on Any-Part & Gear",
  };
}

/* ---------------- PAGE ---------------- */
export default async function PartPage({
  params,
}: {
  params: { partId: string };
}) {
  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.partId)
    .single();

  if (error || !part) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Breadcrumbs category={part.category} title={part.title} />

      <h1>{part.title}</h1>

      {part.image_url && (
        <img
          src={part.image_url}
          alt={part.title}
          style={{
            maxWidth: "100%",
            marginTop: 16,
            borderRadius: 8,
          }}
        />
      )}

      {part.price && (
        <p style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
          Price: ${part.price}
        </p>
      )}

      {part.description && (
        <p style={{ marginTop: 12, lineHeight: 1.6 }}>
          {part.description}
        </p>
      )}

      <Link href="/browse" style={{ display: "inline-block", marginTop: 24 }}>
        ← Back to Browse
      </Link>
    </main>
  );
}
