import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";

interface PartPageProps {
  params: {
    id: string;
  };
}

export default async function PartPage({ params }: PartPageProps) {
  const supabase = await createClient(); // ✅ FIXED

 const { data: part, error } = await supabase
  .from("parts")
  .select("*")
  .eq("id", Number(params.id)) // ✅ REQUIRED
  .single();
  
  if (error || !part) {
    notFound();
  }

  const imageSrc =
    part.image_url && part.image_url.trim() !== ""
      ? part.image_url
      : "/logo.png";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Image
          src={imageSrc}
          alt={part.title}
          width={600}
          height={400}
          className="rounded"
        />
      </div>

      <h1 className="text-3xl font-bold mb-2">{part.title}</h1>

      <p className="text-xl font-semibold mb-4">${part.price}</p>

      {part.description && (
        <p className="text-gray-700">{part.description}</p>
      )}
    </div>
  );
}
