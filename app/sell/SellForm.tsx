import { createClient } from "@/lib/supabaseClient";
import Link from "next/link";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function SellerPage({ params }: PageProps) {
  const supabase = createClient();
  const sellerId = params.id;

  const { data: parts } = await supabase
    .from("parts")
    .select("*")
    .eq("user_id", sellerId)
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: 40 }}>
      <Link href="/browse">← Back to Browse</Link>

      <h1 style={{ marginTop: 20 }}>Seller Listings</h1>

      {!parts || parts.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div style={{ marginTop: 20 }}>
          {parts.map((part) => (
            <div
              key={part.id}
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 10,
                marginBottom: 12,
              }}
            >
              <h3>{part.title}</h3>
              <p>{part.description}</p>

              <Link href={`/parts/${part.id}`}>
                View Part
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
