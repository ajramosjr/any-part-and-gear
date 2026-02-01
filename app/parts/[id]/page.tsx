import { createClient } from "@/lib/supabaseServer";
import Image from "next/image";
import { notFound } from "next/navigation";

type PartPageProps = {
  params: {
    id: string;
  };
};

export default async function PartPage({ params }: PartPageProps) {
  const supabase = createClient();

  const { data: part } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!part) {
    notFound();
  }

  const imageSrc =
    part.image_url && part.image_url.startsWith("http")
      ? part.image_url
      : "/logo.png";

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative h-80 bg-gray-100 rounded">
          <Image
            src={imageSrc}
            alt={part.title}
            fill
            className="object-contain rounded"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{part.title}</h1>

          {part.price && (
            <p className="text-xl text-blue-600 font-semibold mb-4">
              ${part.price}
            </p>
          )}

          {part.description && (
            <p className="text-gray-700 mb-4">
              {part.description}
            </p>
          )}

          {part.fitment && (
            <p className="text-sm text-gray-500">
              Fits: {part.fitment}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
