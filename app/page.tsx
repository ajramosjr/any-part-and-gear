export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabaseServer";

export default async function HomePage() {
  const supabase = createClient();

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
