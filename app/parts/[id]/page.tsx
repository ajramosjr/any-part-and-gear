import { supabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function PartPage({ params }: PageProps) {
  const { id } = params;

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !part) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-gray-100 rounded-xl overflow-hidden">
          {part.image_url ? (
            <img
              src={part.image_url}
              alt={part.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {part.title}
          </h1>

          <p className="text-xl font-semibold text-green-600 mb-4">
            ${part.price}
          </p>

          {part.description && (
            <p className="text-gray-700 mb-6">
              {part.description}
            </p>
          )}

          <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
            {part.condition && (
              <p><strong>Condition:</strong> {part.condition}</p>
            )}
            {part.vehicle && (
              <p><strong>Fits:</strong> {part.vehicle}</p>
            )}
          </div>

          <button className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
            Contact Seller
          </button>
        </div>
      </div>
    </main>
  );
}
