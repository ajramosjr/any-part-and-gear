import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data } = await supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <main style={{ padding: 40 }}>
      <h2>Latest Parts</h2>

      {data?.map((part) => (
        <div key={part.id} style={{ borderBottom: "1px solid #ddd", marginBottom: 10 }}>
          <h3>{part.title}</h3>
          <p>{part.description}</p>
          <strong>${part.price}</strong>
          <p style={{ color: "#666" }}>
  Buy, sell, and trade auto parts
</p>
        </div>
      ))}
    </main>
  );
}
