export const dynamic = "force-dynamic";

import PartCard from "@/components/PartCard";
import { supabase } from "@/lib/supabaseClient";

export default async function HomePage() {
  const { data: parts, error } = await supabase
    .from("parts")
    .select("*")
    .limit(5);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">AnyPartingGear</h1>

      {error && (
        <pre style={{ color: "red" }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts?.map((part) => (
          <PartCard key={part.id} part={part} />
        ))}
      </div>
    </main>
  );
}
