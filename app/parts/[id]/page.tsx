import { supabase } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PartPageProps {
  params: {
    id: string;
  };
}

export default async function PartPage({ params }: PartPageProps) {
  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !part) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/browse"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to Browse
      </Link>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          {part.image_url ? (
            <img
              src={part.image_url}
              alt={part.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {part.title}
          </h1>

          <p className="text-xl font-semibold text-green-600 mb-4">
            ${part.price}
          </p>

          {part.description && (
            <p className="text-gray-700 mb-4">
              {part.description}
            </p>
          )}

          <div className="space-y-2 text-sm text-gray-600">
            {part.condition && (
              <p>
                <strong>Condition:</strong> {part.condition}
              </p>
            )}

            {part.category && (
              <p>
                <strong>Category:</strong> {part.category}
              </p>
            )}

            {part.created_at && (
              <p>
                <strong>Listed:</strong>{" "}
                {new Date(part.created_at).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="mt-6">
            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg cursor-not-allowed"
            >
              Purchase (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
