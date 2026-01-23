import { notFound } from "next/navigation";
import supabase from "@/lib/supabaseServer";
import TradeRequestForm from "@/components/TradeRequestForm";

interface PartPageProps {
  params: {
    id: string;
  };
}

export default async function PartPage({ params }: PartPageProps) {
  const partId = params.id;

  if (!partId) {
    notFound();
  }

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId)
    .single();

  if (error || !part) {
    notFound();
  }

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
        <p className="text-xl font-semibold mb-4">${part.price}</p>
      )}

      {part.trade_available && (
        <div className="mt-6">
          <TradeRequestForm
            partId={part.id}
            receiverId={part.user_id}
          />
        </div>
      )}
    </main>
  );
}
