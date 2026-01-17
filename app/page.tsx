export const dynamic = "force-dynamic";

import PartCard from "@/components/PartCard";
import { createClient } from "@/lib/supabaseServer";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: parts, error } = await supabase
    .from("parts")
    .select("*")
    .limit(6);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">AnyPartingGear</h1>

      <h2 className="text-xl font-semibold mb-4">Latest Parts</h2>

      {error && (
        <p className="text-red-600">Failed to load parts</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts?.map((part) => (
          <PartCard key={part.id} part={part} />
        ))}
      </div>
    </main>
  );
}
