import { supabase } from "@/lib/supabaseClient";
import SellerBadge from "@/components/SellerBadge";
import VerifiedBadge from "@/components/VerifiedBadge";
import TrustScore from "@/components/TrustScore";
import { getSellerTier } from "@/lib/getSellerTier";
import { isVerifiedSeller } from "@/lib/isVerifiedSeller";
import { getTrustScore } from "@/lib/getTrustScore";

type PartPageProps = {
  params: {
    id: string;
  };
};

export default async function PartPage({ params }: PartPageProps) {
  const partId = params.id;

  const { data: part } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId)
    .single();

  if (!part) {
    return <p style={{ padding: 40 }}>Part not found.</p>;
  }

  const sellerId = part.seller_id;

  const tier = await getSellerTier(sellerId);
  const verified = await isVerifiedSeller(sellerId);
  const trust = await getTrustScore(sellerId);

  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1>{part.title}</h1>

      <p style={{ color: "#555", marginTop: 6 }}>{part.description}</p>

      <p style={{ marginTop: 12, fontWeight: 600 }}>
        Price: ${part.price}
      </p>

      <hr style={{ margin: "24px 0" }} />

      <h3>Seller Info</h3>

      <p style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <SellerBadge tier={tier} />
        <VerifiedBadge verified={verified} />
        <TrustScore score={trust} />
      </p>

      <button
        style={{
          marginTop: 24,
          padding: "12px 18px",
          background: "#0f172a",
          color: "#fff",
          borderRadius: 10,
          border: "none",
        }}
      >
        Message Seller
      </button>
    </main>
  );
}
