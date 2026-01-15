export const dynamic = "force-dynamic";

import PartCard from "@/components/PartCard";
import { supabase } from "@/lib/supabaseClient";

export default async function HomePage() {
  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .limit(5);

  return (
    <main style={{ padding: 20 }}>
      <h1>AnyPartingGear</h1>
   <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Latest Parts</h1>
     
      {error && (
        <pre style={{ color: "red" }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      )}

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PartCard
          part={{
            title: "OEM Exhaust Manifold",
            price: 180,
            fitment: "2015–2019 Honda Civic",
          }}
        />
      </div>
    </main>
  );
}
