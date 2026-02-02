import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

type PartPageProps = {
  params: {
    id: string;
  };
};

export default async function PartPage({ params }: PartPageProps) {
  // 🔒 HARD GUARD: only allow numeric IDs
  const partId = Number(params.id);
  if (Number.isNaN(partId)) {
    notFound();
  }

  const supabase = createClient();

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId)
    .single();

  if (error || !part) {
    notFound();
  }

  const images: string[] = Array.isArray(part.images) ? part.images : [];

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">
        {part.title ?? "Untitled Part"}
      </h1>

      {/* Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative w-full aspect-square rounded-lg overflow-hidden border"
            >
              <Image
                src={src}
                alt={`Part image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Details */}
      <div className="space-y-3">
        {part.price && (
          <p className="text-xl font-semibold">
            ${Number(part.price).toLocaleString()}
          </p>
        )}

        {part.description && (
          <p className="text-gray-700">{part.description}</p>
        )}

        <div className="text-sm text-gray-500">
          Part ID: {part.id}
        </div>
      </div>
    </main>
  );
}
