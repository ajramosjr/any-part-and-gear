import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import TradeRequestForm from "@/components/TradeRequestForm";
import { cookies } from "next/headers";

interface PartPageProps {
  params: {
    id: string;
  };
}

export default async function PartPage({ params }: PartPageProps) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies,
    }
  );

  const partId = Number(params.id);
  if (isNaN(partId)) notFound();

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId)
    .single();

  if (error || !part) notFound();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{part.title}</h1>

      {part.images?.length > 0 && (
        <img
          src={part.images[0]}
          alt={part.title}
          className="w-full max-h-[400px] object-cover rounded-lg mb-6"
        />
      )}

      <p className="text-gray-700 mb-4">{part.description}</p>

      {part.price && (
        <p className="text-xl font-semibold mb-6">${part.price}</p>
      )}

      {part.trade_available && (
        <TradeRequestForm
          partId={part.id}
          receiverId={part.user_id}
        />
      )}
    </main>
  );
}
