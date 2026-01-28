import Image from "next/image";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function PartPage({
  params,
}: {
  params: { id: string };
}) {
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

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !part) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-500">Part not found.</p>
      </div>
    );
  }

  const imageSrc =
    part.image_url && part.image_url.trim() !== ""
      ? part.image_url
      : "/images/apg-placeholder.png";

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <div>
          <Image
            src={imageSrc}
            alt={part.title}
            width={600}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-3">{part.title}</h1>

          {part.description && (
            <p className="text-gray-700 mb-4">
              {part.description}
            </p>
          )}

          {part.price && (
            <p className="text-lg font-semibold mb-4">
              ${part.price}
            </p>
          )}

          <div className="flex gap-3 mt-auto">
            <Link
              href={`/trade/${part.id}`}
              className="flex-1 bg-slate-900 text-white text-center px-4 py-2 rounded"
            >
              Propose Trade
            </Link>

            <Link
              href="/"
              className="flex-1 border text-center px-4 py-2 rounded"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
