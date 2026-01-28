import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function PartPage({
  params,
}: {
  params: { id: string };
}) {
  // ✅ FIX: cookies() must be awaited
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  // ✅ Ensure ID is numeric (Supabase expects this)
  const partId = Number(params.id);

  if (Number.isNaN(partId)) {
    notFound();
  }

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", partId)
    .maybeSingle();

  if (error || !part) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{part.title}</h1>

      <Image
        src={part.image_url || "/images/apg-placeholder.png"}
        alt={part.title}
        width={600}
        height={400}
        className="rounded mb-6 object-cover"
      />

      {part.description && (
        <p className="text-gray-700 mb-4">{part.description}</p>
      )}

      {part.price && (
        <p className="text-lg font-semibold mb-6">
          Price: ${part.price}
        </p>
      )}

      <button className="bg-slate-900 text-white px-6 py-3 rounded">
        Trade
      </button>
    </main>
  );
}
