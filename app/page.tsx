export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { createClient } = await import("@supabase/supabase-js");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase.from("parts").select("*").limit(5);

  return (
    <main style={{ padding: 20 }}>
      <h1>AnyPartingGear</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
