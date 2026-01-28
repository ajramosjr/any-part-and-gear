import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function PartDetailPage({ params }: PageProps) {
  const supabase = createClient();

  // ✅ Convert id to number
  const partId = Number(params.id);

  if (Number.isNaN(partId)) {
    notFound();
  }

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId)
    .maybeSingle(); // ✅ safer than single()

  if (error || !part) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{part.title}</h1>

      {part.image_url && (
        <div className="mb-6">
          <Image
            src={part.image_url}
            alt={part.title}
            width={600}
            height={400}
            className="rounded-lg"
          />
        </div>
      )}

      <div className="space-y-2">
        <p className="text-lg font-semibold">${part.price}</p>
        <p className="text-gray-700">{part.description}</p>

        {part.condition && (
          <p>
            <span className="font-medium">Condition:</span>{" "}
            {part.condition}
          </p>
        )}
      </div>
    </div>
  );
}
