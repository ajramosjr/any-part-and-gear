export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabaseServer";

export default async function HomePage() {
  const supabase = await createClient(); // ✅ AWAIT HERE

  const { data } = await supabase
    .from("parts")
    .select("*")
    .limit(5);

  return (
    <main style={{ padding: 20 }}>
      <h1>AnyPartingGear</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
