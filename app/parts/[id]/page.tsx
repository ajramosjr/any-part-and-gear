import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";


export default async function PartPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient(); // ❌ no await

  if (!params.id || typeof params.id !== "string") {
    notFound();
  }

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !part) {
    notFound();
  }

  const imageSrc =
    part.image_url?.startsWith("http")
      ? part.image_url
      : "/logo.png";

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Image
        src={imageSrc}
        alt={part.title}
        width={600}
        height={400}
        className="rounded mb-4"
      />

      <h1 className="text-3xl font-bold">{part.title}</h1>
      <p className="text-xl font-semibold mt-2">${part.price}</p>

      {part.description && (
        <p className="mt-4 text-gray-700">{part.description}</p>
      )}
    </main>
  );
}
