import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: string;
  title: string;
  description: string;
  images?: string[] | null;
};

export default async function SellerPage({
  params,
}: {
  params: { id: string };
}) {
  const sellerId = params.id;

  const { data: parts } = await supabase
    .from("parts")
    .select("*")
    .eq("user_id", sellerId)
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ color: "#fff", marginBottom: 10 }}>
        Seller Listings
      </h1>

      <p style={{ color: "#aaa", marginBottom: 30 }}>
        Seller ID: {sellerId}
      </p>

      <div style={grid}>
        {parts?.map((part) => (
          <div key={part.id} style={card}>
            {part.images?.[0] && (
              <img
                src={part.images[0]}
                style={image}
              />
            )}
            <h3 style={title}>{part.title}</h3>
            <p style={desc}>{part.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

/* STYLES */
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 24,
};

const card = {
  background: "#111",
  padding: 16,
  borderRadius: 14,
};

const image = {
  width: "100%",
  height: 160,
  objectFit: "cover" as const,
  borderRadius: 10,
};

const title = {
  color: "#fff",
  marginTop: 10,
};

const desc = {
  color: "#aaa",
  fontSize: 14,
};
