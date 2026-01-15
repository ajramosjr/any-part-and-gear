export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabaseClient";

export default async function HomePage() {
  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .limit(5);

  return (
    <main style={{ padding: 20 }}>
      <h1>AnyPartingGear</h1>

      {error && (
        <pre style={{ color: "red" }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      )}

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
