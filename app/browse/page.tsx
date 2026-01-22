import Link from "next/link";
import { supabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const { data: parts } = await supabase
    .from("parts")
    .select("id, title, price, image_url")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Browse Parts</h1>

      {!parts || parts.length === 0 && (
        <p className="text-gray-500">No parts listed yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {parts?.map((part) => (
          <Link
            key={part.id}
            href={`/parts/${part.id}`}
            className="border rounded-xl overflow-hidden bg-white hover:shadow-lg transition"
          >
            <div className="h-48 bg-gray-100">
              {part.image_url ? (
                <img
                  src={part.image_url}
                  alt={part.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">
                {part.title}
              </h3>

              <p className="text-green-600 font-bold mt-1">
                ${part.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
