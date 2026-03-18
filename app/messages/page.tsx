import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ sellerId?: string; partId?: string }>;

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ─────────────────────────────────────────────────────────────
  // If coming from a part page ("Message Seller" button):
  // find or create a conversation, then redirect to the chat.
  // ─────────────────────────────────────────────────────────────
  const { sellerId, partId } = params;

  if (sellerId && partId && sellerId !== user.id) {
    // Look for an existing conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("part_id", partId)
      .eq("buyer_id", user.id)
      .eq("seller_id", sellerId)
      .maybeSingle();

    if (existing) {
      redirect(`/messages/${existing.id}`);
    }

    // Create a new conversation
    const { data: created, error: createError } = await supabase
      .from("conversations")
      .insert({
        part_id: partId,
        buyer_id: user.id,
        seller_id: sellerId,
        last_message: "",
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (created && !createError) {
      redirect(`/messages/${created.id}`);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Default: list all conversations for this user
  // ─────────────────────────────────────────────────────────────
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, part_id, last_message, updated_at, buyer_id, seller_id")
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {(!conversations || conversations.length === 0) && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">💬</div>
          <p className="font-medium">No conversations yet.</p>
          <p className="text-sm mt-1">
            Browse parts and click &quot;Message Seller&quot; to start one.
          </p>
          <Link
            href="/browse"
            className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Parts
          </Link>
        </div>
      )}

      {conversations?.map((conv) => (
        <Link
          key={conv.id}
          href={`/messages/${conv.id}`}
          className="block border rounded-lg p-4 mb-4 hover:bg-gray-50 transition"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold">
              {conv.buyer_id === user.id ? "To seller" : "From buyer"} · Part{" "}
              {conv.part_id ? `#${String(conv.part_id).slice(0, 8)}…` : ""}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(conv.updated_at).toLocaleDateString()}
            </p>
          </div>
          {conv.last_message && (
            <p className="text-sm text-gray-600 truncate mt-1">
              {conv.last_message}
            </p>
          )}
        </Link>
      ))}
    </main>
  );
}
