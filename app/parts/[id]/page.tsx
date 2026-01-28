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

  // Get logged-in user (optional, used to prevent trading own item later)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !part) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-xl font-semibold">Part not found</h1>
      </main>
    );
  }

  const imageSrc =
    part.image_url && part.image_url.trim() !== ""
      ? part.image_url
      : "/images/apg-placeholder.png";

  const isOwner = user && user.id === part.user_id;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative w-full h-[350px] bg-gray-100 rounded">
          <Image
            src={imageSrc}
            alt={part.title}
            fill
            className="object-cover rounded"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-3">
            {part.title}
          </h1>

          {part.description && (
            <p className="text-gray-700 mb-4">
              {part.description}
            </p>
          )}

          {part.price && (
            <p className="text-lg font-semibold mb-6">
              ${part.price}
            </p>
          )}

          <div className="mt-auto flex gap-3">
            <Link
              href="/"
              className="border px-4 py-2 rounded text-center"
            >
              Back
            </Link>

            {!isOwner && (
              <Link
                href={`/trade/${part.id}`}
                className="bg-slate-900 text-white px-4 py-2 rounded text-center"
              >
                Propose Trade
              </Link>
            )}

            {isOwner && (
              <Link
                href={`/sell/${part.id}`}
                className="bg-slate-900 text-white px-4 py-2 rounded text-center"
              >
                Edit Listing
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
