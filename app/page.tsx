export const dynamic = "force-dynamic";

import PartCard from "@/components/PartCard";
import { supabase } from "@/lib/supabaseClient";

export default async function HomePage() {
  const { data: parts, error } = await supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">AnyPartingGear</h1>
        <p className="text-gray-600 mt-2">
          Buy, sell, and trade auto & marine parts
        </p>
      </header>

      {/* Section title */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Latest Parts
        </h2>

        {/* Error */}
        {error && (
          <p className="text-red-600">
            Failed to load parts
          </p>
        )}

        {/* Empty state */}
        {!parts || parts.length === 0 ? (
          <p className="text-gray-500">
            No parts listed yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {parts.map((part) => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
