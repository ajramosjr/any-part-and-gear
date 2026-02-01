import Image from "next/image";
import { createClient } from "@/lib/supabaseServer";

export default async function PartPage({
  params,
}: {
  params: { id: string };
}) {
  // ✅ MUST await this
  const supabase = await createClient();

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.id)
    .single();
  
console.log("PART ID:", part.id, typeof part.id);
  
  if (error || !part) {
    return <p className="p-6">Part not found.</p>;
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
        className="rounded mb-4 object-contain bg-gray-50"
      />

      <h1 className="text-2xl font-bold mb-2">
        {part.title}
      </h1>

      {part.price && (
        <p className="text-xl font-semibold text-blue-600 mb-4">
          ${part.price}
        </p>
      )}

      <p className="text-gray-700">
        {part.description}
      </p>
    </main>
  );
}
