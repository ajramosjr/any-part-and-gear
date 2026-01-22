import Link from "next/link";
import { supabase } from "@/lib/supabase/server";

export default async function BrowsePage() {
  const { data: parts } = await supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false });

  if (!parts) {
    return <p className="p-6">No parts available.</p>;
  }

  // Group parts by category
  const groupedParts = parts.reduce((acc: any, part: any) => {
    const category = part.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(part);
    return acc;
  }, {});

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Browse Parts</h1>

      {Object.keys(groupedParts).map((category) => (
        <section key={category} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            {category}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {groupedParts[category].map((part: any) => (
              <Link
                key={part.id}
                href={`/parts/${part.id}`}
                className="border rounded-lg p-4 hover:shadow-lg transition"
              >
                <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center">
                  {part.images?.[0] ? (
                    <img
                      src={part.images[0]}
                      alt={part.title}
                      className="h-full w-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>

                <h3 className="font-semibold">{part.title}</h3>
                {part.price && (
                  <p className="text-sm text-gray-600">
                    ${part.price}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
