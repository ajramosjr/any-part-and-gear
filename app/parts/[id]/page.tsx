import { notFound } from "next/navigation";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type PartPageProps = {
  params: {
    id: string;
  };
};

export default async function PartPage({ params }: PartPageProps) {
  const supabase = await createServerSupabaseClient();

  const partId = Number(params.id);
  if (Number.isNaN(partId)) return notFound();

  const { data: part } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId)
    .single();

  if (!part) return notFound();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{part.title}</h1>
      {part.image && (
        <Image
          src={part.image}
          alt={part.title}
          width={800}
          height={500}
          className="rounded"
        />
      )}
      <p className="mt-4">{part.description}</p>
    </main>
  );
}
