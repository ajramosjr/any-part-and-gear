import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

type PartPageProps = {
  params: {
    id: string;
  };
};

export default async function PartPage({ params }: PartPageProps) {
  const supabase = await createClient();

  const partId = Number(params.id); // ✅ FIX

  if (Number.isNaN(partId)) {
    notFound();
  }

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId) // ✅ number matches int8
    .single();

  if (error || !part) {
    notFound();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{part.title}</h1>

      {part.image_urls?.[0] && (
        <Image
          src={part.image_urls[0]}
          alt={part.title}
          width={600}
          height={400}
          style={{ borderRadius: 8 }}
        />
      )}

      <p style={{ marginTop: 12 }}>${part.price}</p>
      <p>{part.platform}</p>
      <p>{part.category}</p>

      {part.trade_available && (
        <p style={{ color: "green" }}>Trade available</p>
      )}
    </div>
  );
}
